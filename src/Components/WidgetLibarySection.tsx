import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface WidgetLibrarySectionProps {
    title: string;
    children?: React.ReactNode;
}

const WidgetLibrarySection: React.FC<WidgetLibrarySectionProps> = ({ title, children }) => {
    const [isSectionOpen, setIsSectionOpen] = useState(false);

    return (
        <div className='bg-primary p-2 rounded-app border-primary border-2 mb-2'>
            <div>
                <button
                    className='px-2 flex w-full justify-between items-center'
                    onClick={() => setIsSectionOpen(!isSectionOpen)}
                >
                    <h2>{title}</h2>
                    {isSectionOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>
            {isSectionOpen && (
                <div className='px-2'>
                    <hr className='border-1 border-primary my-2'/>
                    <div className='flex flex-col gap-4 py-4'>
                    {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WidgetLibrarySection;