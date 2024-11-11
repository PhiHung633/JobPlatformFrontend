import Step from "./Step/Step";

const Sidebar = ({ currentStep }) => {
  const steps = [
    { step: "1", label: "Heading" },
    { step: "2", label: "Education" },
    { step: "3", label: "Work History" },
    { step: "4", label: "Skills" },
    { step: "5", label: "Summary" },
    { step: "6", label: "Finalize" },
  ];

  return (
    <aside className="bg-gradient-to-b from-green-800 to-green-600 text-white w-1/4 min-h-screen p-8 flex flex-col items-start shadow-lg">
      <h1 className="text-3xl font-bold mb-12 tracking-wide text-white">
        Tạo CV<span className="text-yellow-300"></span>
      </h1>
      <nav className="relative flex flex-col items-start gap-6 w-full">
        {steps.map(({ step, label }, index) => (
          <Step
            key={step}
            step={step}
            label={label}
            active={currentStep === parseInt(step)}
            isLast={index === steps.length - 1}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
