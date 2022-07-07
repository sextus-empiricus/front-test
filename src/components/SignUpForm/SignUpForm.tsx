import React, {ChangeEvent, useState} from 'react';


interface Props {

}

const SignUpForm = (props: Props) => {
    const [inputNameValue, setInputNameValue] = useState<string>('');
    const [inputImageValue, setInputImageValue] = useState<string>('');

    const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'username') {
            setInputNameValue(e.target.value)
        }
        if (e.target.name === 'image') {
            setInputImageValue(e.target.value);
        }
    }

    const submitHandler = (e: any) => {
        e.preventDefault();
        console.log({inputNameValue, inputImageValue})
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label>User name:
                    <input name="username" type="text" value={inputNameValue} onChange={inputOnChangeHandler}/>
                </label>
                <label>Image:
                    <input name="image" type="text" value={inputImageValue} onChange={inputOnChangeHandler}/>
                </label>
                <button>submit</button>
            </form>
        </div>
    );
}

export {
    SignUpForm,
};