'use client'
import React, { useEffect, useState, useRef } from 'react';
import { Statistic, Card, Switch } from 'antd';

const AutoReloadComponent: React.FC = () => {
    const [isAutoReloadEnabled, setIsAutoReloadEnabled] = useState(true); // State to track switch
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const resetTimeout = () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            timeoutIdRef.current = setTimeout(() => {
                if (isAutoReloadEnabled) {
                    window.location.reload();
                }
            }, 2000);  // 60000 ms = 1 minute
        };

        // Immediately reset timeout to start the timeout process
        resetTimeout();

        // Setup event listeners to reset the timeout on user activity
        const handleUserActivity = () => resetTimeout();
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);

        // Cleanup on component unmount
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
        };
    }, [isAutoReloadEnabled]);

    const handleAutoReloadChange = (checked: boolean) => {
        setIsAutoReloadEnabled(checked);
    };

    return (
        <div>
            <h1>Auto-Reload Component</h1>
            <Switch checked={isAutoReloadEnabled} onChange={handleAutoReloadChange} />
        </div>
    );
}

export default AutoReloadComponent;
