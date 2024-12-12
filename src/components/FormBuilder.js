import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormPreview from './FormPreview';
import DraggableElement from './DraggableElement';
import { generateValidationSchema } from '../utils/validationSchema';

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [layout, setLayout] = useState('one');

  const addElement = (type) => {
    setFormElements([
      ...formElements,
      {
        id: Date.now(),
        type,
        label: `${type} Label`,
        options: type === 'dropdown' ? ['Option 1', 'Option 2'] : null,
        validation: { required: false },
      },
    ]);
  };

  const updateElement = (id, updatedProperties) => {
    setFormElements((elements) =>
      elements.map((el) => (el.id === id ? { ...el, ...updatedProperties } : el))
    );
  };

  const moveElement = (dragIndex, hoverIndex) => {
    const updatedElements = [...formElements];
    const [draggedItem] = updatedElements.splice(dragIndex, 1);
    updatedElements.splice(hoverIndex, 0, draggedItem);
    setFormElements(updatedElements);
  };

  const deleteElement = (id) => {
    setFormElements((elements) => elements.filter((el) => el.id !== id));
  };

  const exportCode = () => {
    const schema = generateValidationSchema(formElements);
    const code = `
      import React from 'react';
      import { useForm } from 'react-hook-form';
      import { zodResolver } from '@hookform/resolvers/zod';
      import * as z from 'zod';

      const schema = ${schema};

      const MyForm = () => {
        const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

        const onSubmit = (data) => console.log(data);

        return (
          <form onSubmit={handleSubmit(onSubmit)} className="p-3 border rounded">
            ${formElements
              .map((el) => {
                if (el.type === 'dropdown') {
                  return `
                    <label className="form-label">${el.label}</label>
                    <select className="form-select" {...register('${el.label.toLowerCase().replace(/ /g, '_')}', { required: ${el.validation.required} })}>
                      ${el.options.map((opt) => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>`;
                } else if (el.type === 'checkbox') {
                  return `
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" {...register('${el.label.toLowerCase().replace(/ /g, '_')}', { required: ${el.validation.required} })} />
                      <label className="form-check-label">${el.label}</label>
                    </div>`;
                }
                else if (el.type === 'number') {
                    return `
                        <label className="form-label">${el.label}</label>
                        <input type="number" className="form-control" {...register('${el.label.toLowerCase().replace(/ /g, '_')}', { required: ${el.validation.required} })} />`;
                  }
                return `
                  <label className="form-label">${el.label}</label>
                  <input type="text" className="form-control" {...register('${el.label.toLowerCase().replace(/ /g, '_')}', { required: ${el.validation.required} })} />`;
              })
              .join('\n')}
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
          </form>
        );
      };

      export default MyForm;
    `;
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container m-4">
        <div className="mb-4">
            <h5>Add Elements</h5>
            <button className="btn btn-info me-2" onClick={() => addElement('text')}>Text</button>
            <button className="btn btn-info me-2" onClick={() => addElement('dropdown')}>Dropdown</button>
            <button className="btn btn-info me-2" onClick={() => addElement('checkbox')}>Checkbox</button>
            <button className="btn btn-info me-2" onClick={() => addElement('number')}>Number</button>
            <button className="btn btn-warning" onClick={exportCode}>Copy Code</button>
        </div>
        <div className="layout-picker mb-3">
            <h5>Number of Columns</h5>
            <button className={`btn ${layout === 'one' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setLayout('one')}>One</button>
            <button className={`btn ${layout === 'two' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setLayout('two')}>Two</button>
            <button className={`btn ${layout === 'three' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setLayout('three')}>Three</button>
        </div>
        <FormPreview
          elements={formElements}
          moveElement={moveElement}
          deleteElement={deleteElement}
          updateElement={updateElement}
          layout={layout}
        />
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
