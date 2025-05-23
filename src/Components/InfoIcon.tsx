import * as React from "react";
import Popover from '@mui/material/Popover';

export default function InfoIcon() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    
    return (
    <div>
        <button 
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className="bg-blue-400 text-white px-4 py-2 rounded"
        >
            i
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