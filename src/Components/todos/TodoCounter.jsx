import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

function TodoCounter() {
    const [todoCount, setTodoCount] = useState(0);

    useEffect(() => {
        const fetchTodoCount = async () => {
            try {
                console.log('Reading todos count from database...');
                const todosSnapshot = await getDocs(collection(db, 'todos'));
                setTodoCount(todosSnapshot.size); // Get the size of the snapshot
            } catch (error) {
                console.error('Error fetching todos:', error.message);
            }
        };

        fetchTodoCount();

        const unsubscribe = onSnapshot(collection(db, 'todos'), () => {
            fetchTodoCount();
        });

        return () => unsubscribe();
    }, []);

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            width: 'fit-content',
            margin: 'auto',
            marginTop: '20px',
            marginBottom: '80px',
            textAlign: 'center' // Center the text horizontally
        }}>
            <h2>Total Number of Todos:</h2>
            <div style={{
                fontSize: '36px', // Adjust the font size as needed
                fontWeight: 'bold', // Make the number bold
                marginTop: '10px' // Add margin to create space between the header and the number
            }}>{todoCount}</div>
        </div>
    );
}

export default TodoCounter;
