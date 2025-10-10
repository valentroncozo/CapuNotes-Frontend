import React, { useState } from 'react';
// 1. ✅ Importación CORRECTA del componente Modal de React-Bootstrap
import { Modal, Button, Form } from 'react-bootstrap'; 
import './Cuerda.css';

// El componente debe recibir props para controlar su visibilidad y cerrar.
export default function CuerdaPopUp({ show, onHide, onRegister }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    
    // Asumimos que si estamos en el modal, estamos registrando, 
    // y no usamos editIndex dentro de este componente.

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim() === '' || descripcion.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        // 2. ✅ Llamar a la función de registro del padre
        if (onRegister) {
            onRegister({ nombre, descripcion });
        }

        // Limpiar los campos y cerrar el modal
        setNombre('');
        setDescripcion('');
        onHide(); 
    };

    return (
        // El Modal es el componente raíz, y usa las props show y onHide del padre.
        <Modal show={show} onHide={onHide} centered>
            
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Cuerda</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    
                    <Form.Group className="mb-3" controlId="cuerda">
                        <Form.Label>Nombre de la Cuerda</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Sopranos, Bajos, Tenores"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Notas que abarca, etc."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* 3. ✅ Botón de Guardar: Dentro del Formulario */}
                    <div className="d-flex justify-content-end pt-3">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar Cuerda
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            
            {/* ❌ No se usa Modal.Footer porque los botones están dentro del Form para manejar el submit */}
        </Modal>
    );
}