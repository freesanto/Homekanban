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
        const response = await axios.get('https://ipinfo.io');
        const { city, country } = response.data;

        // Pass the country and city information to the parent component
        onIPInfoChange({ country, city });
      } catch (error) {
        console.error('Error fetching IP information', error);
      }
    };

    fetchIPInfo();
  }, [onIPInfoChange]);

  // No return statement for rendering content directly in this component

  return null;
};

export default YourComponent;
