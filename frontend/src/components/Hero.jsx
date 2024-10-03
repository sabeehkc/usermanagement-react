import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Hero = () => {
  const [apiData, setApiData] = useState([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2FmYmJiOWQyOWNlMjQzNWQ1Y2ZhZDQ4ODA3NzlhYSIsIm5iZiI6MTcyNTk3NjA5Ny4yNzE0MTUsInN1YiI6IjY2ZTA0ZDFiM2JjOTEyOWE4YjI4ZTE4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oHDxNrbeTRSSFBwpYUqR04Sb0I9AmCTl9STmpLBvvBM'
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container className="py-5">
      <Row className="g-4">
        {apiData.map((card, index) => (
          <Col key={index} sm={12} md={6} lg={4} xl={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img 
                variant="top" 
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} 
                alt={card.original_title}
              />
              <Card.Body>
                <Card.Title>{card.original_title}</Card.Title>
                <Card.Text>
                  {card.overview.length > 100 
                    ? card.overview.substring(0, 100) + '...' 
                    : card.overview}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Hero;
