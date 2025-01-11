import React from 'react';
import { Users, Award, Star, BookOpen } from 'lucide-react';
import { Logo } from './Logo';
import { Header } from './Header';
import { Footer } from './Footer';
import { ShareButtons } from './ShareButtons';

interface CommitteeMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  specialization: string;
}

const literaryCommitteeMembers: CommitteeMember[] = [
  {
    name: "د. إسماعيل عبدالغني التميمي",
    role: "رئيس اللجنة",
    image: "/images/committee/za3im.jpg",
    bio: "أستاذ مساعد في اللغويات ومتخصص في النحو العربي، دكتوراة من جامعة العلوم الإسلامية. أستاذ مساعد في جامعة قبرص التركية وجامعة العلوم الإنسانية في تركيا، ومدقق لغوي ومحقق كتب ونصوص، ومؤلف كتب ومقالات في النحو العربي.",
    specialization: "النحو والصرف"
  },
  {
    name: "د. فاطمة محمود",
    role: "نائب رئيس اللجنة",
    image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=600&auto=format&fit=crop&q=80",
    bio: "أستاذ مساعد في اللغويات ومتخصص في النحو العربي، دكتوراة من جامعة العلوم الإسلامية.",
    specialization: "اللغويات الحاسوبية"
  },
  {
    name: "د. أحمد عبد الرحمن",
    role: "عضو اللجنة",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    bio: "أستاذ مساعد في اللغويات ومتخصص في النحو العربي، دكتوراة من جامعة العلوم الإسلامية.",
    specialization: "المعالجة الآلية للغة"
  }
];

interface CommitteeSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  members: CommitteeMember[];
  className?: string;
}

function CommitteeSection({ title, description, icon, members, className = '' }: CommitteeSectionProps) {
  return (
    <div className={`py-8 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-blue-600 text-white rounded-full mb-3">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative pt-[60%]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 right-2 text-white">
                  <h3 className="text-base font-bold">{member.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    {member.role.includes("رئيس") ? (
                      <Award className="w-3 h-3 text-yellow-400" />
                    ) : member.role.includes("نائب") ? (
                      <Star className="w-3 h-3 text-blue-400" />
                    ) : null}
                    <p className="text-xs">{member.role}</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="mb-2">
                  <span className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    {member.specialization}
                  </span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto p-4">
          <Logo />
          <Header />
        </div>
      </header>

      <main className="flex-1">
        <div className="bg-gradient-to-b from-blue-50 to-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-blue-600 text-white rounded-full mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">لجان المراجعة والتطوير</h1>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                فريق متكامل من الخبراء والمتخصصين في مجالات اللغة العربية والتقنية
              </p>
            </div>
          </div>
        </div>

        <CommitteeSection
          title="اللجنة الأدبية"
          description="نخبة من الأساتذة والمتخصصين في مجال اللغة العربية"
          icon={<BookOpen className="w-5 h-5" />}
          members={literaryCommitteeMembers}
        />

        <div className="bg-blue-50 py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-3">مهام اللجان</h2>
              <p className="text-base text-gray-700 mb-4">
                تعمل اللجنة على ضمان دقة وجودة التحليل النحوي والصرفي
              </p>
              <div className="inline-flex items-center gap-2 text-blue-600 text-sm">
                <span>للتواصل مع اللجنة:</span>
                <a 
                  href="mailto:committee@seebawayhgpt.io" 
                  className="hover:underline font-medium"
                >
                  committee@seebawayhgpt.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-3xl mx-auto p-4">
          <div className="mt-4 flex justify-center">
            <ShareButtons />
          </div>
          <Footer />
        </div>
      </footer>
    </div>
  );
}