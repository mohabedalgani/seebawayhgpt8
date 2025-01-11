import { serve } from 'https://deno.fresh.dev/std@v1/http/server.ts';
import { Resend } from 'https://esm.sh/@resend/node';

// Get the API key from environment variables
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

// Add detailed environment logging
console.log('Environment check:', {
  hasResendKey: !!RESEND_API_KEY,
  fromEmail: 'notifications@seebawayhgpt.io',
  adminEmail: 'mohabedalgani@gmail.com'
});

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set');
}

const FROM_EMAIL = 'notifications@seebawayhgpt.io';
const ADMIN_EMAIL = 'mohabedalgani@gmail.com';

const resend = new Resend(RESEND_API_KEY);

interface VotePayload {
  message_id: string;
  vote_type: 'correct' | 'error';
  feedback?: string;
  original_text?: string;
  corrected_text?: string;
  correction_type?: string;
  correction_details?: Record<string, any>;
  review_status: string;
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Function invoked`);

  try {
    // Validate API key
    if (!RESEND_API_KEY) {
      console.error(`[${requestId}] RESEND_API_KEY is not configured`);
      throw new Error('RESEND_API_KEY is not configured');
    }

    const payload: VotePayload = await req.json();
    console.log(`[${requestId}] Received vote payload:`, payload);
    
    // Prepare email content with Arabic labels
    const subject = `تصويت جديد: ${payload.vote_type === 'correct' ? 'صحيح' : 'خطأ'}`;
    const html = `
      <div dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
        <h2>تفاصيل التصويت الجديد</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 10px 0;">
          <p><strong>نوع التصويت:</strong> ${payload.vote_type === 'correct' ? 'صحيح' : 'خطأ'}</p>
          <p><strong>معرف الرسالة:</strong> ${payload.message_id}</p>
          ${payload.original_text ? `
            <div style="margin: 15px 0; padding: 10px; background-color: #fff; border-right: 4px solid #4a90e2;">
              <strong>النص الأصلي:</strong>
              <p style="margin: 5px 0;">${payload.original_text}</p>
            </div>
          ` : ''}
          ${payload.corrected_text ? `
            <div style="margin: 15px 0; padding: 10px; background-color: #fff; border-right: 4px solid #2ecc71;">
              <strong>النص المصحح:</strong>
              <p style="margin: 5px 0;">${payload.corrected_text}</p>
            </div>
          ` : ''}
          ${payload.feedback ? `
            <div style="margin: 15px 0; padding: 10px; background-color: #fff; border-right: 4px solid #f1c40f;">
              <strong>التعليق:</strong>
              <p style="margin: 5px 0;">${payload.feedback}</p>
            </div>
          ` : ''}
          ${payload.correction_type ? `<p><strong>نوع التصحيح:</strong> ${payload.correction_type}</p>` : ''}
          <p><strong>حالة المراجعة:</strong> ${
            payload.review_status === 'pending' ? 'قيد المراجعة' :
            payload.review_status === 'approved' ? 'تمت الموافقة' :
            payload.review_status === 'rejected' ? 'مرفوض' : payload.review_status
          }</p>
          ${payload.correction_details ? `
            <div style="margin-top: 15px;">
              <strong>تفاصيل إضافية:</strong>
              <pre style="background-color: #fff; padding: 10px; border-radius: 4px; margin: 5px 0;">${JSON.stringify(payload.correction_details, null, 2)}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    console.log(`[${requestId}] Attempting to send email to:`, ADMIN_EMAIL);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    if (error) {
      console.error(`[${requestId}] Resend API error:`, error);
      throw error;
    }

    console.log(`[${requestId}] Email sent successfully:`, data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(`[${requestId}] Error in Edge Function:`, error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});