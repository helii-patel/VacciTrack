/**
 * Calculates the age of a child in years, months, and days
 * @param birthDate Child's birth date
 * @returns Object containing years, months, and days
 */
export function calculateAge(birthDate: Date): { years: number; months: number; days: number } {
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  
  // Adjust if birth day hasn't occurred this month yet
  if (days < 0) {
    months--;
    // Get number of days in the previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  // Adjust if birth month hasn't occurred this year yet
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

/**
 * Formats a date in a more readable format
 * @param date The date to format
 * @returns Formatted date string (e.g., "August 15, 2023")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate relative time from now (e.g., "in 5 days", "2 weeks ago")
 * @param date The date to calculate from
 * @returns String describing the relative time
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays === -1) {
    return "Yesterday";
  } else if (diffDays > 0) {
    if (diffDays <= 30) {
      return `In ${diffDays} days`;
    } else if (diffDays <= 60) {
      return `In about a month`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `In about ${months} months`;
    }
  } else {
    const absDiffDays = Math.abs(diffDays);
    if (absDiffDays <= 30) {
      return `${absDiffDays} days ago`;
    } else if (absDiffDays <= 60) {
      return `About a month ago`;
    } else {
      const months = Math.floor(absDiffDays / 30);
      return `About ${months} months ago`;
    }
  }
}

/**
 * Format child's age in a readable format
 * @param birthDate Child's birth date
 * @returns Formatted age string (e.g., "15 months" or "2 years, 3 months")
 */
export function formatChildAge(birthDate: Date | string): string {
  const dateObj = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const { years, months } = calculateAge(dateObj);
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
  }
}

/**
 * Calculate due status of a vaccination
 * @param scheduledDate The scheduled date for vaccination
 * @returns Object containing status and display text
 */
export function getVaccinationDueStatus(scheduledDate: Date | string): { 
  status: 'upcoming' | 'due' | 'overdue'; 
  text: string;
  color: string;
} {
  const dateObj = typeof scheduledDate === "string" ? new Date(scheduledDate) : scheduledDate;
  const now = new Date();
  
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Overdue
    const absDiffDays = Math.abs(diffDays);
    let text;
    
    if (absDiffDays < 7) {
      text = `Overdue by ${absDiffDays} ${absDiffDays === 1 ? 'day' : 'days'}`;
    } else if (absDiffDays < 30) {
      const weeks = Math.floor(absDiffDays / 7);
      text = `Overdue by ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    } else {
      const months = Math.floor(absDiffDays / 30);
      text = `Overdue by ${months} ${months === 1 ? 'month' : 'months'}`;
    }
    
    return { status: 'overdue', text, color: 'text-red-500 bg-red-50' };
  } else if (diffDays <= 7) {
    // Due soon
    let text;
    
    if (diffDays === 0) {
      text = 'Due today';
    } else if (diffDays === 1) {
      text = 'Due tomorrow';
    } else {
      text = `Due in ${diffDays} days`;
    }
    
    return { status: 'due', text, color: 'text-amber-500 bg-amber-50' };
  } else {
    // Upcoming
    let text;
    
    if (diffDays < 30) {
      text = `Due in ${diffDays} days`;
    } else if (diffDays < 60) {
      text = 'Due in about a month';
    } else {
      const months = Math.floor(diffDays / 30);
      text = `Due in about ${months} months`;
    }
    
    return { status: 'upcoming', text, color: 'text-blue-500 bg-blue-50' };
  }
}
