import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table } from 'semantic-ui-react';
import './styles.css';

const App = () => {
    const [data, setData] = useState([]);
    const [itemName, setItemName] = useState(''); // Renaming state to itemName for clarity
    const [editingId, setEditingId] = useState(null);

    const apiEndpoint = 'https://6666cbc6a2f8516ff7a4f7a9.mockapi.io/Project';

    // Fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await axios.get(apiEndpoint);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Create new data (Add)
    const createData = async () => {
        try {
            const response = await axios.post(apiEndpoint, { name: itemName });
            setData([...data, response.data]);
            setItemName(''); // Clear the input field after adding
        } catch (error) {
            console.error('Error creating data:', error);
        }
    };

    // Update existing data (Edit)
    const updateData = async () => {
        try {
            const response = await axios.put(`${apiEndpoint}/${editingId}`, { name: itemName });
            const updatedData = data.map(item =>
                item.id === editingId ? response.data : item
            );
            setData(updatedData);
            setItemName(''); // Clear the input field after update
            setEditingId(null); // Reset editing state
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    // Delete data
    const deleteData = async (id) => {
        try {
            await axios.delete(`${apiEndpoint}/${id}`);
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    // Handle edit
    const handleEdit = (item) => {
        setItemName(item.name); // Populate the input field with the current value
        setEditingId(item.id); // Set the editingId to track which item is being edited
    };

    return (
        <div className="main">
            <Form>
                <Form.Field>
                    <label>Item Name</label>
                    <input
                        placeholder='Item'
                        value={itemName} // Bind the value to itemName state
                        onChange={(e) => setItemName(e.target.value)} // Update the state on input change
                    />
                </Form.Field>
                <Button onClick={editingId ? updateData : createData}>
                    {editingId ? 'Update' : 'Add'} {/* Toggle button text */}
                </Button>
            </Form>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Item Name</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {data.map(item => (
                        <Table.Row key={item.id}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>
                                <Button onClick={() => handleEdit(item)}>Edit</Button>
                                <Button onClick={() => deleteData(item.id)} color="red">Delete</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default App;
