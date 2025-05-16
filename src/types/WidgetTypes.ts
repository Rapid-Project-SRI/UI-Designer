import ButtonWidget from '../Widgets/ButtonWidget';
import GaugeWidget from '../Widgets/GaugeWidget';
import LineWidget from '../Widgets/LineWidget';
import PieWidget from '../Widgets/PieWidget';
import SwitchWidget from '../Widgets/SwitchWidget';
import TextDisplayWidget from '../Widgets/TextDisplayWidget';
import BarWidget from '../Widgets/BarWidget';
import StaticImageWidget from '../Widgets/StaticImageWidget';
import ProgressBarWidget from '../Widgets/ProgressBarWidget';

// maps widget types to their corresponding components
export const widgetTypes = {
    Button: ButtonWidget,
    Gauge: GaugeWidget,
    ProgressBar: ProgressBarWidget,
    Line: LineWidget,
    Pie: PieWidget,
    Switch: SwitchWidget,
    TextDisplay: TextDisplayWidget,
    Bar: BarWidget,
    StaticImage: StaticImageWidget
};