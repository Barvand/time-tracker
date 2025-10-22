import { Clock, BarChart3, Info } from "lucide-react";
import type { JSX } from "react";

type InfoProps = {
  title: string;
  description: string;
  button: string;
  icon: JSX.Element;
};

export const steps: InfoProps[] = [
  {
    title: "Display Information Your Company Needs",
    description:
      "See how many hours you spend on each project and give the correct price to your clients.",
    button: "Learn More",
    icon: <Info className="w-10 h-10 text-[#FF6700]" />,
  },
  {
    title: "Track Time",
    description: "Monitor hours worked across all your projects easily.",
    button: "Start Tracking",
    icon: <Clock className="w-10 h-10 text-[#FF6700]" />,
  },
  {
    title: "Team Insights",
    description: "Get real-time analytics on team performance and workloads.",
    button: "View Insights",
    icon: <BarChart3 className="w-10 h-10 text-[#FF6700]" />,
  },
];

interface InfoCardsProps {
  steps: InfoProps[];
}

const InfoCards = ({ steps }: InfoCardsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <div
          key={index}
          className="group bg-white border border-[#FF6700]/20 rounded-2xl shadow-md p-8 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-300"
        >
          <div>
            <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6700]/10 mx-auto group-hover:bg-[#FF6700]/20 transition">
              {step.icon}
            </div>
            <h3 className="text-2xl font-semibold text-[#343131] text-center mt-6 mb-4">
              {step.title}
            </h3>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              {step.description}
            </p>
          </div>
          <button className="bg-[#FF6700] text-white font-semibold py-3 px-6 self-center hover:bg-[#e85f00] transition cursor-pointer">
            {step.button}
          </button>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
