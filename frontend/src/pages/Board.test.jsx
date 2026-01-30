import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Board from './Board';

jest.mock('axios');

// Mock Drag & Drop library for jsdom
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => <div data-testid="dnd">{children}</div>,
  Droppable: ({ children }) =>
    children(
      { droppableProps: {}, innerRef: jest.fn(), placeholder: null },
      { isDraggingOver: false }
    ),
  Draggable: ({ children }) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
      },
      { isDragging: false }
    ),
}));

describe('Board', () => {
  test('renders columns and loads tasks', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', title: 'A', status: 'TODO', priority: 'HIGH', description: '' },
        { id: '2', title: 'B', status: 'DOING', priority: 'LOW', description: '' },
      ],
    });

    render(<Board />);

    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('A Fazer')).toBeInTheDocument();
    expect(screen.getByText('Em Progresso')).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  test('opens modal and validates required fields', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Board />);

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: /Nova Tarefa/i }));

    expect(screen.getByText('Nova Tarefa')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Criar' }));
    expect(screen.getByText('Título é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Data limite é obrigatória.')).toBeInTheDocument();
  });

  test('submits when valid', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({ data: { id: '10' } });

    render(<Board />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: /Nova Tarefa/i }));

    await userEvent.type(screen.getByPlaceholderText(/Configurar Spring Boot/i), 'Minha task');

    const dateInput = screen.getByLabelText('Data limite *');
    await userEvent.type(dateInput, '2026-02-15');

    const createBtn = screen.getByRole('button', { name: 'Criar' });
    expect(createBtn).toBeEnabled();

    await userEvent.click(createBtn);

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
  test('opens details modal on card click', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', title: 'Card 1', status: 'TODO', priority: 'HIGH', description: 'desc', dueDate: '2026-02-15' },
      ],
    });

    render(<Board />);

    await waitFor(() => expect(screen.getByText('Card 1')).toBeInTheDocument());

    await userEvent.click(screen.getByText('Card 1'));

    expect(screen.getByText('Detalhes da Tarefa')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

});
