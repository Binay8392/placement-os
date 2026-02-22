import { Heart, GraduationCap, Code2, Rocket, Users, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import founderImg from '@/assets/founder-binay.jpeg';
import donationQr from '@/assets/donation-qr.jpeg';
import { useNavigate } from 'react-router-dom';

const timeline = [
  { year: '2023', icon: GraduationCap, title: 'The Beginning', desc: 'Started B.Tech in CSE at IEM Kolkata. Founded WebMitra — my first real venture into building products that matter.' },
  { year: '2024', icon: Code2, title: 'Deep Into Code', desc: 'Mastered DSA, earned certifications from IBM, PW Skills, and global universities. Built Hospital Connect IoT project.' },
  { year: '2025', icon: Star, title: 'AI & Innovation', desc: 'Built MindWell AI Chatbot — an NLP-powered mental health assistant. Started dreaming bigger.' },
  { year: '2026', icon: Rocket, title: 'PrepTrack is Born', desc: 'Launched PrepTrack OS — a complete placement preparation system born from my own struggles and learnings. Every feature is built from real experience.' },
];

export default function SupportUsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <Heart className="w-12 h-12 mx-auto text-destructive animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Help Us Build the Future of<br />
            <span className="text-gradient">Placement Preparation</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            PrepTrack was born from sleepless nights, countless rejections, and an unwavering belief 
            that every student deserves a fair shot at their dream career. Your support keeps this dream alive.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Meet the Founder</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Hi, I'm <strong className="text-foreground">Binay Paramanik</strong> — a Computer Science student 
                at IEM Kolkata (Batch 2027) and the creator of PrepTrack OS.
              </p>
              <p>
                I come from a small town. When placement season started, I saw brilliant students 
                struggling — not because they weren't smart enough, but because they didn't have the right tools 
                and guidance. No structured roadmap. No personalized tracker. No community.
              </p>
              <p>
                That frustration became my fuel. I started coding PrepTrack in January 2026, spending 
                every free hour between classes building something I wished existed when I needed it most.
              </p>
              <p className="text-foreground font-medium italic">
                "Every feature in PrepTrack exists because a student somewhere needed it and couldn't find it."
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Full Stack Developer', 'MERN Stack', 'DSA Enthusiast', 'IEM Kolkata', '8.3 CGPA'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img src={founderImg} alt="Binay Paramanik - Founder of PrepTrack" 
              className="w-72 h-72 object-cover rounded-2xl shadow-lg border-4 border-primary/20" />
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">The PrepTrack Journey</h2>
        <div className="space-y-6">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow shrink-0">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                {i < timeline.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
              </div>
              <div className="pb-6">
                <span className="text-xs font-bold text-primary">{item.year}</span>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Vision */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-primary/20 overflow-hidden">
          <div className="gradient-primary p-8 text-center space-y-4">
            <Users className="w-10 h-10 mx-auto text-primary-foreground" />
            <h2 className="text-2xl font-bold text-primary-foreground">Our Vision</h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto">
              PrepTrack isn't just an app — it's a movement. We envision a world where no student 
              feels lost during placement season. Where preparation is structured, communities are supportive, 
              and everyone has equal access to the tools they need.
            </p>
          </div>
          <CardContent className="p-8">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-gradient">500+</p>
                <p className="text-sm text-muted-foreground mt-1">Students Helped</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient">18+</p>
                <p className="text-sm text-muted-foreground mt-1">Features Built</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient">∞</p>
                <p className="text-sm text-muted-foreground mt-1">Dreams Supported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Donation Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-center md:text-left">
                <Heart className="w-10 h-10 text-destructive mx-auto md:mx-0 animate-pulse" />
                <h2 className="text-2xl font-bold text-foreground">Support Our Mission</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every rupee you contribute goes directly into making PrepTrack better — 
                  better servers, better AI, better features. We're a student-led project with no 
                  VC funding, no corporate backing. Just passion and code.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your donation isn't just money — it's a vote of confidence in a student trying 
                  to make a difference. It tells us, <em className="text-foreground">"Keep going. 
                  What you're building matters."</em>
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>☕ ₹50 — A coffee to keep coding through the night</p>
                  <p>🚀 ₹199 — One month of server costs</p>
                  <p>💎 ₹499 — Unlock AI features for 10 students</p>
                  <p>🌟 ₹999 — You're officially a PrepTrack legend</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <img src={donationQr} alt="Donation QR Code - Scan to support PrepTrack" 
                  className="w-64 h-auto rounded-xl shadow-md" />
                <p className="text-xs text-muted-foreground">UPI ID: binayparamanik3@okaxis</p>
                <p className="text-xs text-muted-foreground italic">Scan with any UPI app to donate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-lg font-semibold text-foreground">Thank you for believing in us. ❤️</p>
        <p className="text-sm text-muted-foreground">Every contribution, big or small, brings us one step closer to our dream.</p>
        <Button onClick={() => navigate('/')} className="rounded-xl">
          <ArrowRight className="w-4 h-4 mr-2" /> Back to PrepTrack
        </Button>
      </section>
    </div>
  );
}
