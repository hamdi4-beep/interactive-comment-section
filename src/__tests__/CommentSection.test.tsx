import {render, fireEvent} from '@testing-library/react';
import CommentSection from '../components/CommentSection';
import { commentCreated } from '../features/comments/CommentsSlice';
import  '@testing-library/jest-dom';

describe('CommentSection Component', () => {
    it('should render comment section with list and form', () => {
        const mockDispatch = jest.fn();
        jest.mock('../hooks', () => ({
            useAppDispatch: () => mockDispatch
        }));

        const { container } = render(<CommentSection />);
        
        expect(container.querySelector('.comment-section')).toBeInTheDocument();
        expect(container.querySelector('CommentsList')).toBeInTheDocument();
        expect(container.querySelector('FormComponent')).toBeInTheDocument();
    });

    it('should dispatch commentCreated action when form is submitted', () => {
        const mockDispatch = jest.fn();
        jest.mock('../hooks', () => ({
            useAppDispatch: () => mockDispatch
        }));

        const { getByPlaceholderText } = render(<CommentSection />);
        const input = getByPlaceholderText('Add a comment...');
        const testComment = 'Test comment';
        
        fireEvent.change(input, { target: { value: testComment }});
        fireEvent.submit(input);

        expect(mockDispatch).toHaveBeenCalledWith(commentCreated(testComment));
    });
});