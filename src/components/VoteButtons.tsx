import React, { useState, useEffect } from 'react';
import { ThumbsUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Modal } from './Modal';
import { useEmailStore } from '../hooks/useEmail';

interface VoteButtonsProps {
  messageId: string;
}

export function VoteButtons({ messageId }: VoteButtonsProps) {
  const { email: storedEmail, setEmail: setStoredEmail } = useEmailStore();
  const [userVote, setUserVote] = useState<'correct' | 'error' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [email, setEmail] = useState(storedEmail);
  const [feedback, setFeedback] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [pendingVoteType, setPendingVoteType] = useState<'correct' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState('');

  useEffect(() => {
    setEmail(storedEmail);
  }, [storedEmail]);

  // Get the original text from the message
  useEffect(() => {
    const getMessage = async () => {
      try {
        const { data: messageData } = await supabase
          .from('messages')
          .select('content')
          .eq('id', messageId)
          .single();

        if (messageData?.content) {
          setOriginalText(messageData.content);
        }
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    getMessage();
  }, [messageId]);

  // Check if user has already voted
  useEffect(() => {
    const checkExistingVote = async () => {
      if (!storedEmail) return;

      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data: voteData, error } = await supabase
          .from('votes')
          .select('vote_type, feedback, corrected_text')
          .eq('message_id', messageId)
          .eq('user_id', userData.user.id);

        if (error) {
          if (error.code === 'PGRST116') {
            setUserVote(null);
            return;
          }
          console.error('Error checking vote:', error);
          return;
        }

        if (voteData && voteData.length > 0) {
          setUserVote(voteData[0].vote_type as 'correct' | 'error');
          if (voteData[0].feedback) {
            setFeedback(voteData[0].feedback);
          }
          if (voteData[0].corrected_text) {
            setCorrectedText(voteData[0].corrected_text);
          }
        } else {
          setUserVote(null);
        }
      } catch (error) {
        console.error('Error checking existing vote:', error);
      }
    };

    checkExistingVote();
  }, [messageId, storedEmail]);

  const handleVote = async (voteType: 'correct' | 'error') => {
    if (isVoting) return;
    
    setPendingVoteType(voteType);
    
    if (!storedEmail) {
      setShowEmailModal(true);
      return;
    }

    if (voteType === 'error') {
      setShowFeedbackModal(true);
      return;
    }

    await submitVote(voteType);
  };

  const submitVote = async (voteType: 'correct' | 'error') => {
    if (!storedEmail) return;
    
    // For error votes, require feedback
    if (voteType === 'error' && !feedback.trim()) {
      setErrorMessage('الرجاء إدخال سبب الخطأ');
      return;
    }
    
    setIsVoting(true);
    setErrorMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: storedEmail,
        });

        if (signInError) throw signInError;
      }

      const voteData = {
        message_id: messageId,
        user_id: user?.id,
        vote_type: voteType,
        feedback: voteType === 'error' ? feedback : null,
        original_text: originalText,
        corrected_text: voteType === 'error' ? correctedText : null,
        correction_type: voteType === 'error' ? 'grammar' : null,
        correction_details: voteType === 'error' ? { feedback } : null,
        review_status: 'pending',
        reviewed: false
      };

      const { error: voteError } = await supabase
        .from('votes')
        .upsert(voteData, {
          onConflict: 'message_id,user_id',
        });

      if (voteError) throw voteError;

      setUserVote(voteType);
      setShowFeedbackModal(false);
      setShowThankYouModal(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      setErrorMessage('عذراً، حدث خطأ أثناء التصويت. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsVoting(false);
      setPendingVoteType(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStoredEmail(email);
    setShowEmailModal(false);

    if (pendingVoteType === 'error') {
      setShowFeedbackModal(true);
    } else if (pendingVoteType) {
      await submitVote(pendingVoteType);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setErrorMessage('الرجاء إدخال سبب الخطأ');
      return;
    }
    
    await submitVote('error');
  };

  return (
    <div className="mt-4 flex justify-end gap-2">
      <button
        onClick={() => handleVote('error')}
        disabled={isVoting || userVote === 'error'}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
          userVote === 'error'
            ? 'bg-red-100 text-red-700'
            : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
        }`}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm">خطأ</span>
      </button>

      <button
        onClick={() => handleVote('correct')}
        disabled={isVoting || userVote === 'correct'}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
          userVote === 'correct'
            ? 'bg-green-100 text-green-700'
            : 'hover:bg-green-50 text-gray-600 hover:text-green-600'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm">صحيح</span>
      </button>

      {/* Email Modal */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)}>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">أدخل بريدك الإلكتروني للتصويت</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            متابعة
          </button>
        </form>
      </Modal>

      {/* Feedback Modal */}
      <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)}>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ما هو الخطأ في هذا الإعراب؟</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">النص الاصلي</label>
            <textarea
              value={correctedText}
              onChange={(e) => setCorrectedText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="أدخل النص الخطأ هنا..."
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">النص المصحح</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
              placeholder="اشرح الصح هنا..."
              dir="rtl"
              required
            />
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            إرسال
          </button>
        </form>
      </Modal>

      {/* Thank You Modal */}
      <Modal isOpen={showThankYouModal} onClose={() => setShowThankYouModal(false)}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">شكراً لك!</h3>
          <p className="text-gray-600">تم تسجيل تصويتك بنجاح.</p>
          <button
            onClick={() => setShowThankYouModal(false)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            حسناً
          </button>
        </div>
      </Modal>
    </div>
  );
}