import React from "react";
import { FaEdit } from "react-icons/fa";
import { VscDebugDisconnect } from "react-icons/vsc";

interface WidgetCardProps {
  header?: string;
  children?: React.ReactNode;
  edit? : (event: React.MouseEvent) => void;
}

/*
 * WidgetCard displays a widget preview with an optional edit button and header.
 * Used in the widget palette/library to represent draggable widgets.
 *
 * @param {WidgetCardProps} props - The card header, children, and optional edit handler.
 * @returns {JSX.Element} The rendered widget card.
 */
export const WidgetCard = ({ header, children, edit }: WidgetCardProps) => {
  return (
    <div className="overflow-hidden rounded-app shadow-lg bg-primary border-2 border-secondary">
      <div className="bg-secondary text-white p-1.5 flex items-center justify-between gap-2">
        <p>{header || "No Header available"}</p>
        {/* Only show edit button if edit handler is provided */}
        {edit && (
          <button className="btn-error p-1" onClick={edit}><FaEdit/></button>
        )}
      </div>
      <div className="p-1">
        {children || <p>No content available</p>}
      </div>
    </div>
  );
};
