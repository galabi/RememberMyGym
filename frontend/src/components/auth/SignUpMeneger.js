import React, { useState } from 'react';
import SignUp from './SignUp';
import UserDetails from './UserDetails';

const SignUpManager = ({ onSignUpSuccess, onLoginClick }) => {
    const [step, setStep] = useState(1); // 1: SignUp, 2: UserDetails
    const [tempUser, setTempUser] = useState(null);

    const handleNextStep = (user) => {
        setTempUser(user);
        setStep(2);
    };

    return (
        <>
            {step === 1 ? (
                <SignUp onNextStep={handleNextStep} onLoginClick={onLoginClick} />
            ) : (
                <UserDetails mappedUser={tempUser} onSignUpSuccess={onSignUpSuccess} />
            )}
        </>
    );
};

export default SignUpManager;