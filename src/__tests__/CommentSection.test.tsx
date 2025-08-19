import { render } from "@testing-library/react"
import '@testing-library/jest-dom'

// @ts-ignore
import React from "react"
import CommentSection from "../components/CommentSection"

describe('A test suit for the main components', () => {
    it('CommentSection component renders properly', () => {
        const comp = render(<CommentSection />)
        expect(comp.container).toBeInTheDocument()
    })
})