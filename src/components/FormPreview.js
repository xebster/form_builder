import React from 'react';
import DraggableElement from './DraggableElement';

const FormPreview = ({ elements, moveElement, deleteElement, updateElement, layout }) => {
  const getColumnClass = () => {
    switch (layout) {
      case 'one':
        return 'col-12'; // Full width for one column
      case 'two':
        return 'col-md-6'; // Half width for two columns
      case 'three':
        return 'col-md-4'; // One-third width for three columns
      default:
        return 'col-12';
    }
  };

  return (
    <div className="form-preview row">
      {elements.map((element, index) => (
        <div key={element.id} className={`${getColumnClass()} mb-3`}>
          <DraggableElement
            index={index}
            element={element}
            moveElement={moveElement}
            deleteElement={deleteElement}
            updateElement={updateElement}
          />
        </div>
      ))}
    </div>
  );
};

export default FormPreview;
