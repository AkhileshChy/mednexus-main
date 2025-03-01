'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useScroll } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
    Calendar, MessageCircle, Activity, Book, Settings,
    Moon, Sun, Heart, Award, Bell, Clock, Sparkles, Brain,
    Zap, Fingerprint, TrendingUp, Target, Coffee, Music,
    Focus, Smile, Cloud, Droplets, ChevronRight, BarChart2,
    Mic, MicOff,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const VoiceControl = ({ commands }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let recognitionInstance = null;

        try {
            if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
                recognitionInstance = new window.webkitSpeechRecognition();
                recognitionInstance.continuous = true;
                recognitionInstance.interimResults = false;

                recognitionInstance.onresult = (event) => {
                    const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                    console.log('Voice command received:', command);

                    Object.entries(commands).forEach(([key, action]) => {
                        if (command.includes(key.toLowerCase())) {
                            action();
                        }
                    });
                };

                recognitionInstance.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setError(event.error);
                    setIsListening(false);
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                };

                setRecognition(recognitionInstance);
            }
        } catch (err) {
            console.error('Speech recognition initialization error:', err);
            setError(err.message);
        }

        return () => {
            if (recognitionInstance) {
                recognitionInstance.stop();
            }
        };
    }, [commands]);

    const toggleListening = () => {
        if (error) {
            alert('Speech recognition error: ' + error);
            return;
        }

        if (!recognition) {
            alert('Speech recognition is not supported in your browser');
            return;
        }

        try {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
            setIsListening(!isListening);
        } catch (err) {
            console.error('Error toggling speech recognition:', err);
            setError(err.message);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50
                ${isListening ? 'bg-red-500 text-white' : 'bg-purple-500 text-white'}`}
            aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
        >
            {isListening ? (
                <MicOff className="h-6 w-6" />
            ) : (
                <Mic className="h-6 w-6" />
            )}
        </motion.button>
    );
};

const Dashboard = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { scrollYProgress } = useScroll();
    const [activeSection, setActiveSection] = useState('overview');
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState('week');
    const [selectedChart, setSelectedChart] = useState('mood');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = window.localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && mounted) {
            window.localStorage.setItem('theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    }, [theme, mounted]);

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [moodData] = useState([
        { day: 'Mon', mood: 7, energy: 6, focus: 8, productivity: 75, sleep: 7.5, meditation: 20 },
        { day: 'Tue', mood: 6, energy: 7, focus: 7, productivity: 80, sleep: 8, meditation: 15 },
        { day: 'Wed', mood: 8, energy: 8, focus: 6, productivity: 85, sleep: 7, meditation: 25 },
        { day: 'Thu', mood: 7, energy: 6, focus: 8, productivity: 70, sleep: 6.5, meditation: 10 },
        { day: 'Fri', mood: 9, energy: 9, focus: 9, productivity: 90, sleep: 8.5, meditation: 30 },
        { day: 'Sat', mood: 8, energy: 7, focus: 8, productivity: 65, sleep: 9, meditation: 20 },
        { day: 'Sun', mood: 8, energy: 8, focus: 7, productivity: 75, sleep: 8, meditation: 25 },
    ]);

    const voiceCommands = {
        'hello mind guru': () => {
            if (mounted) {
                router.push('/mental-health-chatbot');
            }
        },
        'contact therapist': () => {
            if (mounted) {
                router.push('/contact');
            }
        },
        'ai therapist': () => {
            if (mounted) {
                router.push('/ai-therapist');
            }
        },
        'therapy cards': () => {
            if (mounted) {
                router.push('/therapycards');
            }
        },
        'logout': () => {
            if (mounted) {
                router.push('/login');
            }
        },
        'log mood': () => console.log('Logging mood'),
        'start meditation': () => console.log('Starting meditation'),
        'open journal': () => console.log('Opening journal'),
        'start exercise': () => console.log('Starting exercise'),
        'switch theme': () => setTheme(theme === 'light' ? 'dark' : 'light'),
        'show daily': () => setSelectedTimeframe('day'),
        'show weekly': () => setSelectedTimeframe('week'),
        'show monthly': () => setSelectedTimeframe('month'),
        'show yearly': () => setSelectedTimeframe('year'),
        'show mood chart': () => setSelectedChart('mood'),
        'show energy chart': () => setSelectedChart('energy'),
        'show focus chart': () => setSelectedChart('focus')
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = () => {
        try {
            router.push('/chatbot');
        } catch (err) {
            console.error('Navigation error:', err);
        }
    };

    const handleLogout = () => {
        try {
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const CustomBox = ({
        children,
        className = "",
        animate = true,
        hover = true,
        padding = "p-6",
        onClick
    }) => (
        <motion.div
            whileHover={hover ? {
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
            } : {}}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                bg-white/90 dark:bg-gray-800/90 
                rounded-2xl shadow-lg backdrop-blur-lg 
                border border-gray-100 dark:border-gray-700 
                ${padding} ${className}
                ${onClick ? 'cursor-pointer' : ''}
            `}
        >
            {children}
        </motion.div>
    );

    const LoadingScreen = () => (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                <Brain className="h-16 w-16 text-white" />
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        boxShadow: [
                            "0 0 20px rgba(139, 92, 246, 0.3)",
                            "0 0 40px rgba(139, 92, 246, 0.6)",
                            "0 0 20px rgba(139, 92, 246, 0.3)"
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </motion.div>
    );

    const TimeframeSelector = () => (
        <motion.div
            className="flex space-x-2 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            {['day', 'week', 'month', 'year'].map((timeframe) => (
                <motion.button
                    key={timeframe}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors
                        ${selectedTimeframe === timeframe
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                    onClick={() => setSelectedTimeframe(timeframe)}
                >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </motion.button>
            ))}
        </motion.div>
    );

    const StatBox = ({ icon: Icon, label, value, trend, color }) => (
        <CustomBox className="relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                </div>
                {trend && (
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                        <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'transform rotate-180' : ''}`} />
                        <span className="text-sm font-medium">{Math.abs(trend)}%</span>
                    </motion.div>
                )}
            </motion.div>
            <motion.div
                className="absolute -right-4 -bottom-4 opacity-5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Icon className="h-24 w-24" />
            </motion.div>
        </CustomBox>
    );

    const WeatherWidget = () => (
        <CustomBox>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <motion.div
                        animate={{
                            y: [0, -5, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Cloud className="h-8 w-8 text-blue-500" />
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-semibold">72°F</h3>
                        <p className="text-sm text-gray-500">Partly Cloudy</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">45%</span>
                </div>
            </div>
        </CustomBox>
    );

    const InsightBox = () => (
        <CustomBox className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Daily Insight</h3>
                    <p className="text-sm opacity-90">Your mood tends to be highest after meditation sessions. Consider adding an evening session to improve sleep quality.</p>
                </div>
                <Sparkles className="h-6 w-6" />
            </div>
            <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 mt-4 text-sm opacity-90"
            >
                <span>View detailed analysis</span>
                <ChevronRight className="h-4 w-4" />
            </motion.button>
        </CustomBox>
    );

    const ChartBox = () => (
        <CustomBox className="h-96">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold mb-1">Wellness Trends</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Track your daily progress
                    </p>
                </div>
                <div className="flex space-x-2">
                    {['mood', 'energy', 'focus'].map((metric) => (
                        <motion.button
                            key={metric}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedChart(metric)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium
                                ${selectedChart === metric
                                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </motion.button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodData}>
                    <defs>
                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey={selectedChart}
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorMetric)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </CustomBox>
    );

    if (!mounted) {
        return null;
    }

    return (
        <AnimatePresence>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <div className={`min-h-screen ${theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                    : 'bg-gradient-to-br from-purple-50 to-indigo-50 text-gray-900'}`}
                >
                    <VoiceControl commands={voiceCommands} />

                    <motion.div
                        className="fixed top-0 left-0 right-0 h-1 bg-purple-500 transform-none z-50"
                        style={{ scaleX }}
                    />

                    <div className="container mx-auto px-8 pt-24 pb-12">
                        <TimeframeSelector />

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ staggerChildren: 0.1 }}
                        >
                            <StatBox
                                icon={Heart}
                                label="Heart Rate"
                                value="70 bpm"
                                trend={12}
                                color="bg-red-500"
                            />
                            <StatBox
                                icon={Zap}
                                label="Steps"
                                value="824"
                                trend={5}
                                color="bg-yellow-500"
                            />
                            <StatBox
                                icon={Focus}
                                label="SpO2"
                                value="97%"
                                trend={-3}
                                color="bg-blue-500"
                            />
                            <StatBox
                                icon={Clock}
                                label="Calories Burned"
                                value="40 cal"
                                trend={15}
                                color="bg-purple-500"
                            />
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <ChartBox />
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <WeatherWidget />
                                    <InsightBox />
                                </motion.div>
                            </div>

                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <CustomBox>
                                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Book, text: "CBC Report Analysis", time: "2h ago" },
                                            { icon: Activity, text: "Logged mood entry", time: "5h ago" },
                                            { icon: Coffee, text: "Morning routine completed", time: "8h ago" },
                                            { icon: Music, text: "Added to calm playlist", time: "1d ago" }
                                        ].map((activity, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center space-x-3"
                                            >
                                                <activity.icon className="h-5 w-5 text-purple-500" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{activity.text}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CustomBox>

                                <CustomBox>
                                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { icon: Heart, label: "Log Mood" },
                                            { icon: Brain, label: "Meditate" },
                                            { icon: Book, label: "Journal" },
                                            { icon: Activity, label: "Exercise" }
                                        ].map((action, index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 
                                                    flex flex-col items-center space-y-2"
                                            >
                                                <action.icon className="h-6 w-6 text-purple-500" />
                                                <span className="text-sm font-medium">{action.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </CustomBox>
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Dashboard;