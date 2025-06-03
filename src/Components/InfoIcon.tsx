import * as React from "react";
import Popover from '@mui/material/Popover';
import { IoInformationCircleOutline } from "react-icons/io5";

/*
 * InfoIcon displays an information icon with a popover for help text.
 * Shows instructions for using the UI editor when hovered.
 *
 * @returns {JSX.Element} The rendered info icon and popover.
 */
export default function InfoIcon() {
    // State for the anchor element to control the popover
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    /*
     * Opens the popover when the mouse enters the icon.
     * @param {React.MouseEvent<HTMLElement>} event - The mouse event.
     * @return {void}
     */
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /*
     * Closes the popover when the mouse leaves the icon.
     * @return {void}
     */
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
  
    // Boolean for popover open state
    const open = Boolean(anchorEl);
    
    return (
    <div>
        <button 
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className="text-white rounded"
        >
            <IoInformationCircleOutline size={25} color='var(--color-primary)' />
        </button>
        <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
        }}
        transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        >
            {/* Help text for the UI editor */}
            This is the UI editor. Upload your json<br />
            file of nodes from the Data Simulation <br />
            Framework and drag and drop widgets you <br />
            want from the left side bar. Click on <br />
            each widget and connect them with the <br />
            streams on the right.
        </Popover>
    </div>
  );
}