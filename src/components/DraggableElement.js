import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableElement = ({ element, index, moveElement, deleteElement, updateElement }) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [label, setLabel] = useState(element.label);
  const [options, setOptions] = useState(element.options || []);

  const [, ref] = useDrag({
    type: 'form-element',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'form-element',
    hover: (item) => {
      if (item.index !== index) {
        moveElement(item.index, index);
        item.index = index;
      }
    },
  });

  const saveLabel = () => {
    setIsEditingLabel(false);
    updateElement(element.id, { label });
  };

  const handleOptionChange = (optionIndex, value) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = value;
    setOptions(updatedOptions);
    updateElement(element.id, { options: updatedOptions });
  };

  const addOption = () => {
    const updatedOptions = [...options, `Option ${options.length + 1}`];
    setOptions(updatedOptions);
    updateElement(element.id, { options: updatedOptions });
  };

  const removeOption = (optionIndex) => {
    const updatedOptions = options.filter((_, idx) => idx !== optionIndex);
    setOptions(updatedOptions);
    updateElement(element.id, { options: updatedOptions });
  };

  return (
    <div ref={(node) => drop(ref(node))} className="form-element border p-3 rounded mb-2">
      <div className="label-container mb-2">
        {isEditingLabel ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={saveLabel}
            autoFocus
            className="form-control"
          />
        ) : (
          <label onClick={() => setIsEditingLabel(true)}>{label}</label>
        )}
      </div>
      {element.type === 'text' && <input type="text" className="form-control" placeholder={label} />}
      {element.type === 'dropdown' && (
        <div className="dropdown-editor">
          {options.map((option, idx) => (
            <div key={idx} className="d-flex align-items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="form-control me-2"
              />
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeOption(idx)}
                title="Remove Option"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
          <button className="btn btn-success btn-sm" onClick={addOption}>
            Add Option
          </button>
        </div>
      )}
      {element.type === 'number' && <input type="number" className="form-control" />}
      {element.type === 'checkbox' && <input type="checkbox" />}
      <button
        className="btn btn-danger btn-sm mt-3"
        onClick={() => deleteElement(element.id)}
        title="Delete Element"
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};

export default DraggableElement;
