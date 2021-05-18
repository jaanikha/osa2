import React from 'react'


const Course = ({course}) => {
    console.log(course);
    return (
      <div>
        <Header course= {course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
}
  
  
const Header = (props) => {
  return (
    <div>
      <h1>
        {props.course}
      </h1>
    </div>
  )
}


const Content = ({parts}) => {

  const content = 
    parts.map(part => 
      <p key={part.id}>
        {part.name} {part.exercises}
      </p>
    )

  return (
    <div>
      <Part content={content} />
    </div>
  )
}

const Part = ({content}) => {
  return (
    <div>
        {content}
    </div>
  )
}


const Total = ({parts}) => {

  const exercises = 
    parts.map(part => part.exercises
  )

  return (
    <div>
      <p><b>
        Number of exercises {exercises.reduce((result,number)=> result+number)}
      </b></p>
    </div>
  )
}
  

export default Course