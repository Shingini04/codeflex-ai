"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GenerateProgramPage = () => {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    injuries: '',
    fitness_goal: '',
    workout_days: '',
    fitness_level: '',
    dietary_restrictions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const questions = [
    {
      id: 'age',
      title: 'What is your age?',
      type: 'number',
      placeholder: 'Enter your age',
      validation: (value) => {
        const age = parseInt(value);
        if (!age || age < 13 || age > 100) return 'Please enter a valid age between 13 and 100';
        return null;
      }
    },
    {
      id: 'weight',
      title: 'What is your current weight?',
      subtitle: 'This helps us calculate your BMI and recommend appropriate exercises',
      type: 'number',
      placeholder: 'Enter your weight in kg',
      validation: (value) => {
        const weight = parseFloat(value);
        if (!weight || weight < 30 || weight > 300) return 'Please enter a valid weight between 30-300 kg';
        return null;
      }
    },
    {
      id: 'height',
      title: 'What is your height?',
      subtitle: 'This helps us calculate your BMI accurately',
      type: 'number',
      placeholder: 'Enter your height in cm',
      validation: (value) => {
        const height = parseFloat(value);
        if (!height || height < 100 || height > 250) return 'Please enter a valid height between 100-250 cm';
        return null;
      }
    },
    {
      id: 'injuries',
      title: 'Do you have any existing injuries or physical limitations?',
      subtitle: 'We\'ll customize your program to work around any limitations',
      type: 'textarea',
      placeholder: 'Describe any injuries, joint issues, or physical limitations (or write "None" if you have no injuries)',
      validation: (value) => {
        if (!value || value.trim().length < 2) return 'Please provide information about injuries or write "None"';
        return null;
      }
    },
    {
      id: 'fitness_goal',
      title: 'What is your primary fitness goal?',
      type: 'select',
      options: [
        { value: 'muscle_gain', label: 'Gaining Muscle' },
        { value: 'weight_loss', label: 'Losing Weight' },
        { value: 'general_fitness', label: 'General Fitness & Health' },
        { value: 'strength', label: 'Building Strength' },
        { value: 'endurance', label: 'Improving Endurance' }
      ],
      validation: (value) => {
        if (!value) return 'Please select your primary fitness goal';
        return null;
      }
    },
    {
      id: 'workout_days',
      title: 'How many days per week can you exercise?',
      type: 'select',
      options: [
        { value: '2', label: '2 days per week' },
        { value: '3', label: '3 days per week' },
        { value: '4', label: '4 days per week' },
        { value: '5', label: '5 days per week' },
        { value: '6', label: '6 days per week' },
        { value: '7', label: '7 days per week' }
      ],
      validation: (value) => {
        if (!value) return 'Please select how many days you can workout';
        return null;
      }
    },
    {
      id: 'fitness_level',
      title: 'What is your current fitness level?',
      type: 'select',
      options: [
        { value: 'beginner', label: 'Beginner - New to exercise or returning after a long break' },
        { value: 'intermediate', label: 'Intermediate - Regular exercise for 6+ months' },
        { value: 'advanced', label: 'Advanced - Consistent training for 2+ years' }
      ],
      validation: (value) => {
        if (!value) return 'Please select your fitness level';
        return null;
      }
    },
    {
      id: 'dietary_restrictions',
      title: 'Do you have any dietary restrictions or preferences?',
      subtitle: 'This helps us create a nutrition plan that works for you',
      type: 'textarea',
      placeholder: 'List any allergies, dietary restrictions, or food preferences (vegetarian, vegan, gluten-free, etc.) or write "None"',
      validation: (value) => {
        if (!value || value.trim().length < 2) return 'Please provide dietary information or write "None"';
        return null;
      }
    }
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const validateStep = () => {
    const question = questions[currentStep];
    const value = formData[question.id];
    const error = question.validation(value);
    
    if (error) {
      setErrors({ [question.id]: error });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (isLastStep) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setErrors({});
  };

  const handleInputChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    // Clear error when user starts typing
    if (errors[currentQuestion.id]) {
      setErrors(prev => ({ ...prev, [currentQuestion.id]: null }));
    }
  };
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    if (!user) {
      alert('Please sign in to generate your fitness program');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting fitness program data:', formData);
      
      // Now this should work with CORS headers added to your Convex endpoint
      const response = await fetch('https://glorious-ptarmigan-360.convex.site/vapi/generate-program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          injuries: formData.injuries,
          workout_days: parseInt(formData.workout_days),
          fitness_goal: formData.fitness_goal,
          fitness_level: formData.fitness_level,
          dietary_restrictions: formData.dietary_restrictions,
        }),
      });
  
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `API Error (${response.status})`);
      }
  
      const result = await response.json();
      console.log('API Result:', result);
  
      if (result.success) {
        console.log('Program generated successfully:', result.data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/profile");
      } else {
        throw new Error(result.error || 'Failed to generate program');
      }
      
    } catch (error) {
      console.error('Error generating program:', error);
      alert(`Failed to generate your fitness program: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = () => {
    const { type, placeholder, options } = currentQuestion;
    const value = formData[currentQuestion.id];
    const error = errors[currentQuestion.id];

    switch (type) {
      case 'select':
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleInputChange(option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  value === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {option.label}
              </button>
            ))}
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>
        );
      
      case 'textarea':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full p-4 rounded-lg border-2 bg-card resize-none min-h-[120px] transition-colors ${
                error ? 'border-destructive' : 'border-border focus:border-primary'
              } focus:outline-none`}
            />
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>
        );
      
      default:
        return (
          <div>
            <input
              type={type}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full p-4 rounded-lg border-2 bg-card text-lg transition-colors ${
                error ? 'border-destructive' : 'border-border focus:border-primary'
              } focus:outline-none`}
            />
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>
        );
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col min-h-screen text-foreground items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Generating Your Program</h2>
          <p className="text-muted-foreground">Creating your personalized fitness and nutrition plan...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Answer a few questions to create your personalized fitness and nutrition plan
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Question {currentStep + 1} of {questions.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-card/90 backdrop-blur-sm border border-border p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
            {currentQuestion.subtitle && (
              <p className="text-muted-foreground">{currentQuestion.subtitle}</p>
            )}
          </div>

          {renderInput()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-8 py-3"
          >
            ← Previous
          </Button>

          <Button
            onClick={handleNext}
            className="px-8 py-3 bg-primary hover:bg-primary/90"
          >
            {isLastStep ? 'Generate Program →' : 'Next →'}
          </Button>
        </div>

        {/* Summary Preview */}
        {currentStep > 0 && (
          <Card className="bg-muted/50 border border-border p-4 mt-8">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Your Answers So Far:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {questions.slice(0, currentStep).map((q, index) => {
                const value = formData[q.id];
                const displayValue = q.options 
                  ? q.options.find(opt => opt.value === value)?.label || value
                  : value;
                
                return (
                  <div key={q.id} className="flex justify-between">
                    <span className="text-muted-foreground">{q.title.replace('?', '')}:</span>
                    <span className="font-medium text-right max-w-[200px] truncate" title={displayValue}>
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GenerateProgramPage;