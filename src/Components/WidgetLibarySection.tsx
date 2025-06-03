import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface WidgetLibrarySectionProps {
    title: string;
    children?: React.ReactNode;
}

/*
 * WidgetLibrarySection is a collapsible section for grouping widgets in the palette/library.
 * Displays a section header and toggles visibility of its children on click.
 *
 * @param {WidgetLibrarySectionProps} props - The section title and children to display.
 * @returns {JSX.Element} The rendered collapsible section.
 */
const WidgetLibrarySection: React.FC<WidgetLibrarySectionProps> = ({ title, children }) => {
    // State to track if the section is open or collapsed
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
            {/* Only render children if section is open */}
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