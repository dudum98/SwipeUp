  'use client';
  import React, { useState, useEffect } from 'react';
  import { useUser } from '@clerk/clerk-react';
  import { useSearchParams } from 'next/navigation';
  import { db } from '../firebase';
  import { collection, doc, getDocs } from 'firebase/firestore';
  import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

  export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
      async function getFlashcard() {
        if (!search || !user) return;

        const colRef = collection(doc(collection(db, 'users'), user.id), search);
        const docs = await getDocs(colRef);
        const flashcards = [];
        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(flashcards);
      }
      getFlashcard();
    }, [search, user]);

    const handleCardClick = (id) => {
      setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    return (
      <Container className="flashcard-page">
      <Container maxWidth="md">
      <Typography className="flashcard-title" variant="h1" component="h1">
          Flashcards
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard) => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                  <CardContent>
                    <Box sx={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s', transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                      <div style={{ position: 'relative', height: '150px' }}>
                        <div style={{ position: 'absolute', backfaceVisibility: 'hidden' }}>
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div style={{ position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                          <Typography variant="h5" component="div">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Container>
    );
  }
