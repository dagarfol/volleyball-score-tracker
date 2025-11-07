import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import staticImages from './badges';

// --- Styled Components Definitions ---

const ComboboxWrapper = styled.div`
    display: flex;
    width: 100%;
    gap: 5px;
    align-items: center;
`;

const InputWrapper = styled.div`
    position: relative;
    flex-grow: 1;
    box-sizing: border-box;
`;

const StyledInput = styled.input`
    padding: 8px;
    box-sizing: border-box;
    width: 100%;
`;

const SuggestionsList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid #ccc;
    list-style-type: none;
    padding: 0;
    margin: 0;
    background: white;
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
`;

const SuggestionItem = styled.li`
    padding: 8px;
    cursor: pointer;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    &:hover {
        background-color: #f0f0f0;
    }
`;

const ItemImage = styled.img`
    width: 40px;
`;

const PreviewImage = styled.img`
    width: 100px;
`;

const PlaceholderSquare = styled.div`
    width: 100px;
    height: 100px; /* Make it a square */
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    /* Optional: Add a simple background color/text indicator */
    &::before {
        content: 'No Image';
        font-size: 10px;
        color: #888;
        text-align: center;
        line-height: 1.2;
    }

    /* CSS for both diagonals using pseudo-elements */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /* Using a linear gradient to draw the diagonal line */
        background: linear-gradient(to top right, transparent calc(50% - 1px), #ccc calc(50% - 1px), #ccc calc(50% + 1px), transparent calc(50% + 1px)),
                    linear-gradient(to bottom right, transparent calc(50% - 1px), #ccc calc(50% - 1px), #ccc calc(50% + 1px), transparent calc(50% + 1px));
    }
`;
// --- The Main Component ---

const CustomCombobox = ({ placeholderText, inputValue, onInputChange }) => {
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const comboboxRef = useRef(null);

    const suggestions = useMemo(() => {
        if (inputValue.length > 0) {
            return staticImages.filter(image =>
                image.name.toLowerCase().includes(inputValue.toLowerCase()) || image.path.toLowerCase().includes(inputValue.toLowerCase())
            );
        }
        return staticImages;
    }, [inputValue]);

    const handleSelect = (path) => {
        onInputChange(path);
        setIsSuggestionsOpen(false);
    };

    const handleChange = (e) => {
        onInputChange(e.target.value);
        if (e.target.value.length > 0) {
            setIsSuggestionsOpen(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsSuggestionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <ComboboxWrapper>
            <InputWrapper ref={comboboxRef}>
                <StyledInput
                    id="image-combo-input"
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => suggestions.length > 0 && setIsSuggestionsOpen(true)}
                    placeholder={placeholderText}
                />

                {isSuggestionsOpen && suggestions.length > 0 && (
                    <SuggestionsList>
                        {suggestions.map((image) => (
                            <SuggestionItem
                                key={image.id}
                                onClick={() => handleSelect(image.path)}
                            >
                                {image.name}
                                <ItemImage src={image.path} alt={image.name} />
                            </SuggestionItem>
                        ))}
                    </SuggestionsList>
                )}
            </InputWrapper>
            
            {inputValue ? (
                <PreviewImage src={inputValue} alt="Preview" />
            ) : (
                <PlaceholderSquare /> 
            )}
        </ComboboxWrapper>
    );
};

export default CustomCombobox;
