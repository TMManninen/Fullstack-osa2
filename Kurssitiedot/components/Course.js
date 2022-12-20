const countSum = (props) => {
    const p = [...props.course.parts]
    const exercises = p.map(parts => parts.exercises)
    const sum = exercises.reduce((acc, currentValue) => acc + currentValue, 0)
    return sum
}

const Course = (props) => {
    console.log(props.course.parts[1])
    return (
        <>
            <Header
                course={props.course.name} />
            <Content parts={[...props.course.parts]} />
            <Total sum={countSum(props)} />
        </>
    )
}

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>


const Content = ({ parts }) => {
    return (
        parts.map((part, i) => <Part key={i} part={part} />)
    )
}

export default Course