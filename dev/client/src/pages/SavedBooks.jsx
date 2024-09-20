import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';


import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Apollo Client's useQuery to get user data
  const { loading, error, data } = useQuery(GET_ME, {
    context: {
      headers: {
        authorization: Auth.loggedIn() ? `Bearer ${Auth.getToken()}` : '',
      },
    },
    skip: !Auth.loggedIn(),
  });

  // Rename the data from the query for clarity
  const userData = data?.me || {};

  // Mutation to remove a book
  const [removeBook] = useMutation(REMOVE_BOOK, {
    context: {
      headers: {
        authorization: Auth.loggedIn() ? `Bearer ${Auth.getToken()}` : '',
      },
    },
    // Use the `update` function to update the cache manually after the mutation
    update(cache, { data: { removeBook } }) {
      try {
        // Read the current GET_ME query from the cache
        const { me } = cache.readQuery({ query: GET_ME });

        // Write the new data to the cache, removing the deleted book
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: {
              ...me,
              savedBooks: me.savedBooks.filter((book) => book.bookId !== removeBook.bookId),
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  // Handle the delete book operation
  const handleDeleteBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });

      // Remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle loading state
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Handle error state
  if (error) {
    console.error(error);
    return <h2>Something went wrong!</h2>;
  }

  

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
