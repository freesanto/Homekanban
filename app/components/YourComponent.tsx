import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IPInfo {
  country: string | null;
  city: string | null;
}

interface YourComponentProps {
  onIPInfoChange: (ipInfo: IPInfo) => void;
}

const YourComponent: React.FC<YourComponentProps> = ({ onIPInfoChange }) => {
  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        const response = await axios.get('https://ipinfo.io', {
          params: {
            token: '15e0aa1eca8e96',
          },
        });

        const { country, city } = response.data; // 提取country和city
        onIPInfoChange({ country, city });
      } catch (error) {
        console.error('Error fetching IP info:', error);
      }
    };

    fetchIPInfo();
  }, [onIPInfoChange]);

  // No return statement for rendering content directly in this component

  return null;
};

export default YourComponent;
