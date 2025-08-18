import { render } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from "react"

describe('A test suit for the Component', () => {
    it('The component can render', () => {
        const comp = render(<Component />)
        expect(comp.container).toBeInTheDocument()
    })
})

function Component() {
    return (
        <div className="component"></div>
    )
}