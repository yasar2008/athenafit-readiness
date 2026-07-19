import { useState, useEffect } from "react";

export interface CheckInData {
  sleep: number;
  energy: number;
  stress: number;
  soreness: number;
  timeAvailable: number;
}

export type ReadinessStatus = "ready" | "recovery" | "rest" | "risk";

export interface DayProgress {
  day: string;
  completed: boolean;
  type: "workout" | "recovery" | "rest" | "pending";
  score?: number;
}

export interface Recommendation {
  type: "workout" | "recovery" | "rest";
  title: string;
  description: string;
  duration: string;
  intensity: string;
  explanation: string;
}

export interface UserProfile {
  name: string;
  email: string;
  focus: "Hybrid Athlete" | "Strength/Power" | "Cardio Endurance" | "Recovery/Mobility";
  goal: string;
  role?: "athlete" | "coach";
  score?: number;
  status?: ReadinessStatus;
  checkInTime?: string;
  checkInData?: CheckInData;
}

const DEFAULT_CHECK_IN: CheckInData = {
  sleep: 4,
  energy: 3,
  stress: 3,
  soreness: 2,
  timeAvailable: 3,
};

const DEFAULT_WEEK_DATA: DayProgress[] = [
  { day: "Mon", completed: true, type: "workout", score: 85 },
  { day: "Tue", completed: true, type: "recovery", score: 72 },
  { day: "Wed", completed: true, type: "workout", score: 88 },
  { day: "Thu", completed: false, type: "pending" },
  { day: "Fri", completed: false, type: "pending" },
  { day: "Sat", completed: false, type: "pending" },
  { day: "Sun", completed: false, type: "pending" },
];

const PRE_POPULATED_USERS: UserProfile[] = [
  { 
    name: "Coach Marcus (Admin)", 
    email: "marcus@athenafit.com", 
    focus: "Hybrid Athlete", 
    goal: "Coaching Staff Operations", 
    role: "coach"
  },
  { 
    name: "Alex Rivera", 
    email: "alex@athenafit.com", 
    focus: "Hybrid Athlete", 
    goal: "Marathon & 500lb Squat", 
    role: "athlete",
    score: 88, 
    status: "ready", 
    checkInTime: "07:15 AM",
    checkInData: { sleep: 5, energy: 4, stress: 2, soreness: 2, timeAvailable: 4 }
  },
  { 
    name: "Sarah Jenkins", 
    email: "sarah@athenafit.com", 
    focus: "Strength/Power", 
    goal: "Olympic Weightlifting Clean", 
    role: "athlete",
    score: 72, 
    status: "recovery", 
    checkInTime: "06:30 AM",
    checkInData: { sleep: 3, energy: 3, stress: 3, soreness: 3, timeAvailable: 4 }
  },
  { 
    name: "Michael Chen", 
    email: "mike@athenafit.com", 
    focus: "Cardio Endurance", 
    goal: "Sub-20min 5K Run", 
    role: "athlete",
    score: 48, 
    status: "risk", 
    checkInTime: "08:00 AM",
    checkInData: { sleep: 2, energy: 2, stress: 4, soreness: 4, timeAvailable: 3 }
  },
  { 
    name: "Jessica Taylor", 
    email: "jess@athenafit.com", 
    focus: "Recovery/Mobility", 
    goal: "Injury Prevention & Flex", 
    role: "athlete",
    score: 92, 
    status: "ready", 
    checkInTime: "09:12 AM",
    checkInData: { sleep: 5, energy: 5, stress: 1, soreness: 1, timeAvailable: 5 }
  },
];

const DEFAULT_ADMIN_LOGS = [
  "System Initialized: Biometric database loaded.",
  "Mock user database pre-populated with 4 active athletes.",
  "Daily environmental advisory: Heat advisory parsed successfully."
];

export const calculateScore = (data: CheckInData): number => {
  const sleepWeight = 0.30;
  const energyWeight = 0.25;
  const stressWeight = 0.20;
  const sorenessWeight = 0.15;
  const timeWeight = 0.10;

  const sleepScore = (data.sleep / 5) * 100;
  const energyScore = (data.energy / 5) * 100;
  const stressScore = ((6 - data.stress) / 5) * 100;
  const sorenessScore = ((6 - data.soreness) / 5) * 100;
  const timeScore = (data.timeAvailable / 5) * 100;

  return Math.round(
    sleepScore * sleepWeight +
    energyScore * energyWeight +
    stressScore * stressWeight +
    sorenessScore * sorenessWeight +
    timeScore * timeWeight
  );
};

export const getStatusFromScore = (score: number): ReadinessStatus => {
  if (score >= 80) return "ready";
  if (score >= 65) return "recovery";
  if (score >= 50) return "rest";
  return "risk";
};

export const getRecommendation = (score: number, data: CheckInData): Recommendation => {
  const status = getStatusFromScore(score);

  if (status === "ready") {
    let title = "High-Intensity Training";
    let desc = "Optimized for heavy lifting, athletic intervals, or endurance work.";
    let duration = "60-90 min";
    let intensity = "High (8-9/10)";
    let explanation = `Your sleep (${data.sleep}/5) and energy (${data.energy}/5) are outstanding. Combined with low stress, your central nervous system is fully primed to absorb high physical strain today.`;
    
    if (data.timeAvailable <= 2) {
      title = "Express MetCon Workout";
      desc = "Short, high-intensity functional circuit to maximize strain in minimal time.";
      duration = "20-30 min";
      intensity = "High (9/10)";
      explanation = `Your biological readiness is peak, but time is short (${data.timeAvailable}/5). An express metabolic conditioning circuit will give you maximum training stimulus without running late.`;
    }
    
    return { type: "workout", title, description: desc, duration, intensity, explanation };
  } 
  
  if (status === "recovery") {
    let title = "Aerobic & Technical Focus";
    let desc = "Zone 2 cardio, skill development, or moderate volume resistance training.";
    let duration = "45-60 min";
    let intensity = "Moderate (5-7/10)";
    let explanation = `Your body is capable, but sleep quality was moderate. Focus on technical execution and building aerobic base rather than testing maximum thresholds.`;

    if (data.stress >= 4) {
      title = "Stress-Relief Conditioning";
      desc = "Rhythmic, steady-state cardio or moderate resistance with extended recovery.";
      duration = "30-45 min";
      intensity = "Light-Medium (5/10)";
      explanation = `Your energy is decent, but your stress level is high (${data.stress}/5). We've switched your plan to a rhythmic flow designed to lower cortisol and clear fatigue rather than add mental load.`;
    }
    
    return { type: "recovery", title, description: desc, duration, intensity, explanation };
  }

  if (status === "rest") {
    return {
      type: "rest",
      title: "Active Recovery Flow",
      description: "Low-impact mobility, gentle walking, light stretching, and deep breathing.",
      duration: "20-30 min",
      intensity: "Very Low (2-3/10)",
      explanation: `Elevated muscle soreness (${data.soreness}/5) or sleep debt indicates incomplete recovery. Today, focus on promoting circulation to sore muscles without accumulating metabolic fatigue.`,
    };
  }

  return {
    type: "rest",
    title: "Complete Rest Day",
    description: "Prioritize sleep, hydration, nutrition, and mental decompression. No training.",
    duration: "Rest Protocol",
    intensity: "None (0/10)",
    explanation: `Your aggregate biometrics display acute fatigue. With a readiness score of ${score}%, today is a dedicated rest day to prevent systemic overtraining, injury, or illness.`,
  };
};

export const useReadiness = () => {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("athenafit-theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  // Check-in state
  const [checkInData, setCheckInData] = useState<CheckInData>(() => {
    const saved = localStorage.getItem("athenafit-checkin");
    return saved ? JSON.parse(saved) : DEFAULT_CHECK_IN;
  });

  const [hasCheckedIn, setHasCheckedIn] = useState<boolean>(() => {
    return localStorage.getItem("athenafit-has-checked-in") === "true";
  });

  // Auth User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("athenafit-current-user");
    return saved ? JSON.parse(saved) : null;
  });

  // User List state (representing database)
  const [userList, setUserList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("athenafit-user-list");
    if (saved) return JSON.parse(saved);
    return PRE_POPULATED_USERS;
  });

  // Admin Audit Logs state
  const [adminLogs, setAdminLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem("athenafit-admin-logs");
    if (saved) return JSON.parse(saved);
    return DEFAULT_ADMIN_LOGS;
  });

  // Admin verified state
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(() => {
    return sessionStorage.getItem("athenafit-admin-verified") === "true" || currentUser?.role === "coach";
  });

  useEffect(() => {
    if (currentUser?.role === "coach") {
      setIsAdminVerified(true);
      sessionStorage.setItem("athenafit-admin-verified", "true");
    }
  }, [currentUser]);

  const [weekData, setWeekData] = useState<DayProgress[]>(() => {
    const saved = localStorage.getItem("athenafit-week-data");
    if (saved) return JSON.parse(saved);

    const isSubmitted = localStorage.getItem("athenafit-has-checked-in") === "true";
    if (isSubmitted) {
      const data = DEFAULT_WEEK_DATA;
      const savedCheckin = localStorage.getItem("athenafit-checkin");
      if (savedCheckin) {
        const cData = JSON.parse(savedCheckin);
        const score = calculateScore(cData);
        const status = getStatusFromScore(score);
        const type = status === "ready" ? "workout" : status === "recovery" ? "recovery" : "rest";
        return data.map((d: DayProgress) => 
          d.day === "Thu" ? { ...d, completed: true, score, type } : d
        );
      }
    }
    return DEFAULT_WEEK_DATA;
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("athenafit-user-list", JSON.stringify(userList));
  }, [userList]);

  useEffect(() => {
    localStorage.setItem("athenafit-admin-logs", JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("athenafit-current-user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("athenafit-current-user");
    }
  }, [currentUser]);

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("athenafit-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAdminLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 49)]); // Cap logs at 50 entries
  };

  // Sign Up a new user
  const signUpUser = (name: string, email: string, focus: UserProfile["focus"], goal: string) => {
    const newUser: UserProfile = {
      name,
      email,
      focus,
      goal,
      checkInTime: undefined,
      checkInData: undefined
    };
    
    const exists = userList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      const updatedList = userList.map((u) => 
        u.email.toLowerCase() === email.toLowerCase() ? { ...u, name, focus, goal } : u
      );
      setUserList(updatedList);
      setCurrentUser({ ...exists, name, focus, goal });
      addLog(`Athlete Profile Updated: ${name} (${email})`);
    } else {
      setUserList((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      addLog(`New Athlete Registered: ${name} (${email})`);
    }
  };

  // Sign In user by email
  const signInUser = (email: string): boolean => {
    const user = userList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      addLog(`Athlete Session Started: ${user.name} logged in.`);
      return true;
    }
    return false;
  };

  // Sign Out user
  const signOutUser = () => {
    if (currentUser) {
      addLog(`Athlete Session Ended: ${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
    setHasCheckedIn(false);
    setIsAdminVerified(false);
    sessionStorage.removeItem("athenafit-admin-verified");
    localStorage.removeItem("athenafit-has-checked-in");
  };

  const submitCheckIn = (data: CheckInData) => {
    setCheckInData(data);
    setHasCheckedIn(true);

    const score = calculateScore(data);
    const status = getStatusFromScore(score);
    const type = status === "ready" ? "workout" : status === "recovery" ? "recovery" : "rest";

    // Update Thursday
    const updatedWeek = weekData.map((d) =>
      d.day === "Thu" ? { ...d, completed: true, score, type } : d
    );

    setWeekData(updatedWeek);
    localStorage.setItem("athenafit-checkin", JSON.stringify(data));
    localStorage.setItem("athenafit-has-checked-in", "true");
    localStorage.setItem("athenafit-week-data", JSON.stringify(updatedWeek));

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        score, 
        status, 
        checkInTime: timeNow,
        checkInData: data
      };
      setCurrentUser(updatedUser);
      
      const updatedList = userList.map((u) =>
        u.email.toLowerCase() === currentUser.email.toLowerCase()
          ? updatedUser
          : u
      );
      setUserList(updatedList);
      addLog(`Readiness Score Logged: ${currentUser.name} submitted score of ${score}%.`);
    } else {
      const guestEmail = "guest@athenafit.com";
      const guestUser = userList.find((u) => u.email === guestEmail) || {
        name: "Guest Athlete",
        email: guestEmail,
        focus: "Hybrid Athlete" as const,
        goal: "General Conditioning",
      };
      const updatedGuest = { ...guestUser, score, status, checkInTime: timeNow, checkInData: data };
      
      const updatedList = userList.some((u) => u.email === guestEmail)
        ? userList.map((u) => (u.email === guestEmail ? updatedGuest : u))
        : [...userList, updatedGuest];
        
      setUserList(updatedList);
      addLog(`Guest Readiness Score Logged: Submitted score of ${score}%.`);
    }
  };

  const resetCheckIn = () => {
    setHasCheckedIn(false);
    const updatedWeek = weekData.map((d) =>
      d.day === "Thu" ? { ...d, completed: false, score: undefined, type: "pending" as const } : d
    );
    setWeekData(updatedWeek);
    localStorage.removeItem("athenafit-has-checked-in");
    localStorage.setItem("athenafit-week-data", JSON.stringify(updatedWeek));

    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        score: undefined, 
        status: undefined, 
        checkInTime: undefined,
        checkInData: undefined 
      };
      setCurrentUser(updatedUser);
      setUserList(userList.map((u) => u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u));
      addLog(`Biometrics Reset: ${currentUser.name} cleared today's check-in.`);
    }
  };

  // ADMIN-ONLY DB MODIFIERS
  const deleteUser = (email: string) => {
    const user = userList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setUserList(userList.filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
      addLog(`Database Purge: Athlete profile for '${user.name}' removed by Admin.`);
      if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
        setCurrentUser(null);
        setHasCheckedIn(false);
        localStorage.removeItem("athenafit-has-checked-in");
      }
    }
  };

  const addUser = (name: string, email: string, focus: UserProfile["focus"], goal: string) => {
    const exists = userList.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newUser: UserProfile = {
      name,
      email,
      focus,
      goal,
      checkInTime: undefined,
      checkInData: undefined
    };
    setUserList((prev) => [...prev, newUser]);
    addLog(`Database Entry: Athlete '${name}' added manually by Admin.`);
    return true;
  };

  const resetUserCheckIn = (email: string) => {
    const user = userList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      const updatedUser = { 
        ...user, 
        score: undefined, 
        status: undefined, 
        checkInTime: undefined,
        checkInData: undefined 
      };
      setUserList(userList.map((u) => u.email.toLowerCase() === email.toLowerCase() ? updatedUser : u));
      addLog(`Biometrics Forced Reset: today's log for '${user.name}' cleared by Admin.`);
      
      if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
        setCurrentUser(updatedUser);
        setHasCheckedIn(false);
        localStorage.removeItem("athenafit-has-checked-in");
      }
    }
  };

  const verifyAdminKey = (key: string): boolean => {
    if (key === "ATHENA2026") {
      sessionStorage.setItem("athenafit-admin-verified", "true");
      setIsAdminVerified(true);
      addLog("Coach Access Authorized: passcode verified.");
      return true;
    }
    addLog("Coach Access Denied: invalid passcode input attempt.");
    return false;
  };

  const currentScore = calculateScore(checkInData);
  const currentStatus = getStatusFromScore(currentScore);
  const currentRecommendation = getRecommendation(currentScore, checkInData);

  return {
    theme,
    toggleTheme,
    checkInData,
    hasCheckedIn,
    currentUser,
    userList,
    adminLogs,
    isAdminVerified,
    currentScore,
    currentStatus,
    currentRecommendation,
    weekData,
    submitCheckIn,
    resetCheckIn,
    signUpUser,
    signInUser,
    signOutUser,
    deleteUser,
    addUser,
    resetUserCheckIn,
    addLog,
    verifyAdminKey
  };
};
