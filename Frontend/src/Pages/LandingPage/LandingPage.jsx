import React, { useEffect } from 'react';
import { Vote, BarChart3, Users, Lock, Share2, Clock, Activity, CheckCircle2, Zap, Shield, Globe2 } from 'lucide-react';
import '../../index.css'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'


function NavBar() {
    return (
        <nav className="fixed w-full z-50 bg-black/10 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-2 animate-slide-down">
                        <Activity className="h-8 w-8 text-indigo-500 animate-bounce-subtle" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text animate-shimmer">
                            PollVibe
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 animate-slide-down">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors hover:scale-105 transform">Features</a>
                        <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors hover:scale-105 transform">How It Works</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors hover:scale-105 transform">Pricing</a>
                        <SignedOut>
                            <SignInButton
                                className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/20 transition-all hover:scale-105 transform"
                            >
                                <span>Sign In</span>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-8 h-8 ring-2 ring-blue-500 ring-offset-2",
                                        userButtonPopoverCard: "shadow-xl border border-gray-100 rounded-lg",
                                        userButtonTrigger: "hover:bg-gray-100 rounded-full p-1 transition-colors"
                                    }
                                }}

                            />
                        </SignedIn>
                        {/* <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/20 transition-all hover:scale-105 transform">
                            Sign In

                        </button> */}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function FeatureCard({ icon: Icon, title, description, delay }) {
    return (
        <div className={`reveal reveal-delay-${delay} bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group`}>
            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}

function PricingCard({ title, price, features, popular = false }) {
    return (
        <div className={`reveal p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] backdrop-blur-lg relative ${popular
            ? 'bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border-indigo-500/50'
            : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}>
            {popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold text-white">
                    Most Popular
                </div>
            )}
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text">{title}</h3>
            <div className="mb-6">
                <span className="text-4xl font-bold text-white">{price}</span>
                {price !== 'Free' && <span className="text-gray-400 ml-2">/month</span>}
            </div>
            <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${popular
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                : 'bg-white/10 text-white hover:bg-white/20'
                }`}>
                Get Started
            </button>
        </div>
    );
}

function StatCard({ icon: Icon, title, value }) {
    return (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <h4 className="text-3xl font-bold text-white mb-1">{value}</h4>
                <p className="text-gray-400">{title}</p>
            </div>
        </div>
    );
}

function LandingPage() {
    useEffect(() => {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1
        });

        document.querySelectorAll('.reveal').forEach(element => {
            observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
            <NavBar />

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-32 pb-40">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-block mb-4 px-6 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 animate-slide-down">
                            <span className="text-indigo-400">✨ Welcome to the Future of Polling</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight animate-slide-up">
                            Create Engaging Polls in Seconds with{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text animate-shimmer">PollVibe</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl animate-slide-up">
                            The simplest way to gather opinions, make decisions, and engage with your audience.
                            Create beautiful polls that get results.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-scale-in">
                            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-indigo-500/25 relative overflow-hidden group">
                                <span className="absolute inset-0 bg-shimmer animate-shimmer"></span>
                                <span className="relative">Create Your First Poll</span>
                            </button>
                            <button className="bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-300 border border-white/10">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative animate-float">
                        <div className="relative z-10 bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-white/10 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2070"
                                alt="Poll Dashboard"
                                className="rounded-xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-xl shadow-xl animate-bounce-subtle">
                                <p className="text-white font-semibold">Join 10,000+ users creating amazing polls</p>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-10 -z-10"></div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard icon={Users} title="Active Users" value="10K+" />
                    <StatCard icon={Vote} title="Polls Created" value="50K+" />
                    <StatCard icon={Globe2} title="Countries" value="120+" />
                    <StatCard icon={Zap} title="Responses/Day" value="100K+" />
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 py-24">
                <h2 className="text-4xl font-bold text-center mb-6 reveal">
                    Everything You Need for Perfect Polls
                </h2>
                <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto reveal reveal-delay-1">
                    Powerful features wrapped in a beautiful, intuitive interface. Create polls that engage and inspire.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={Vote}
                        title="Easy Creation"
                        description="Create professional polls in minutes with our intuitive interface. No technical skills required."
                        delay="1"
                    />
                    <FeatureCard
                        icon={BarChart3}
                        title="Real-time Results"
                        description="Watch responses roll in instantly with live updates and beautiful visualizations."
                        delay="2"
                    />
                    <FeatureCard
                        icon={Users}
                        title="Multiple Response Types"
                        description="Choose from various question types including multiple choice, rating scales, and more."
                        delay="3"
                    />
                    <FeatureCard
                        icon={Lock}
                        title="Secure & Private"
                        description="Control who can vote with password protection and email verification options."
                        delay="1"
                    />
                    <FeatureCard
                        icon={Share2}
                        title="Easy Sharing"
                        description="Share your polls instantly via link, email, or embed them on your website."
                        delay="2"
                    />
                    <FeatureCard
                        icon={Clock}
                        title="Time Controls"
                        description="Set duration limits and schedule polls to start and end automatically."
                        delay="3"
                    />
                </div>
            </div>

            {/* How It Works */}
            <div className="container mx-auto px-4 py-24">
                <h2 className="text-4xl font-bold text-center mb-6 reveal">
                    Create Your Poll in 3 Simple Steps
                </h2>
                <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto reveal reveal-delay-1">
                    We've made the process simple and straightforward. Get started in minutes.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-5xl mx-auto">
                    <div className="flex-1 text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 reveal reveal-delay-1 hover:scale-105 transition-all duration-300">
                        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text mb-6 animate-bounce-subtle">1</div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Create</h3>
                        <p className="text-gray-400 text-lg">
                            Enter your question and add response options. Customize settings as needed.
                        </p>
                    </div>
                    <div className="flex-1 text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 reveal reveal-delay-2 hover:scale-105 transition-all duration-300">
                        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text mb-6 animate-bounce-subtle">2</div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Share</h3>
                        <p className="text-gray-400 text-lg">
                            Share your poll link with your audience through any channel.
                        </p>
                    </div>
                    <div className="flex-1 text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 reveal reveal-delay-3 hover:scale-105 transition-all duration-300">
                        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text mb-6 animate-bounce-subtle">3</div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Analyze</h3>
                        <p className="text-gray-400 text-lg">
                            Get instant insights with real-time results and detailed analytics.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="container mx-auto px-4 py-24">
                <h2 className="text-4xl font-bold text-center mb-6 reveal">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto reveal reveal-delay-1">
                    Choose the plan that best fits your needs. All plans include our core features.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <PricingCard
                        title="Basic"
                        price="Free"
                        features={[
                            "Up to 5 active polls",
                            "100 responses per poll",
                            "Basic analytics",
                            "Email support"
                        ]}
                    />
                    <PricingCard
                        title="Pro"
                        price="$29"
                        features={[
                            "Unlimited active polls",
                            "Unlimited responses",
                            "Advanced analytics",
                            "Custom branding",
                            "Priority support"
                        ]}
                        popular={true}
                    />
                    <PricingCard
                        title="Enterprise"
                        price="$99"
                        features={[
                            "Everything in Pro",
                            "SSO Integration",
                            "API Access",
                            "Dedicated support",
                            "Custom features"
                        ]}
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-24">
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl p-12 text-center relative overflow-hidden backdrop-blur-lg border border-white/10">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6 reveal">
                            Ready to Create Your First Poll?
                        </h2>
                        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto reveal reveal-delay-1">
                            Join thousands of users who trust PollVibe for their polling needs.
                            Start creating engaging polls today!
                        </p>
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-5 rounded-xl text-xl font-semibold text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 reveal reveal-delay-2">
                            Get Started for Free
                        </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10 blur-3xl"></div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-24">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-center space-x-2 mb-8">
                        <Activity className="h-8 w-8 text-indigo-500" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text">
                            PollVibe
                        </span>
                    </div>
                    <div className="text-center text-gray-400">
                        <p>© 2024 PollVibe. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;