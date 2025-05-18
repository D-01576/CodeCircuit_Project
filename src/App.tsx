import { useState, useEffect } from 'react';
import { ChakraProvider, Container, VStack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useColorMode, IconButton, Box, useToast } from '@chakra-ui/react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './config/firebase';
import { Flashcard } from './components/Flashcard';
import { Dashboard } from './components/Dashboard';
import { CardCreator } from './components/CardCreator';
import { Card, calculateNextReview } from './utils/sm2';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { theme } from './theme';

const MotionVStack = motion(VStack);

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewStats, setReviewStats] = useState<{ date: string; correct: number; total: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const cardsQuery = query(
        collection(db, 'cards'),
        where('nextReview', '<=', now)
      );
      
      const querySnapshot = await getDocs(cardsQuery);
      const loadedCards = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Card[];
      
      setCards(loadedCards);
    } catch (error) {
      toast({
        title: 'Error loading cards',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (quality: number) => {
    if (currentCardIndex >= cards.length) return;

    try {
      const card = cards[currentCardIndex];
      const updatedCard = calculateNextReview(card, quality);
      
      await updateDoc(doc(db, 'cards', card.id), updatedCard);
      
      const newCards = [...cards];
      newCards[currentCardIndex] = updatedCard;
      setCards(newCards);
      
      const today = new Date().toISOString().split('T')[0];
      const todayStats = reviewStats.find(stat => stat.date === today) || { date: today, correct: 0, total: 0 };
      todayStats.total += 1;
      if (quality >= 3) todayStats.correct += 1;
      
      setReviewStats(prev => {
        const filtered = prev.filter(stat => stat.date !== today);
        return [...filtered, todayStats];
      });

      setCurrentCardIndex(prev => prev + 1);

      // Show feedback toast
      toast({
        title: quality >= 3 ? 'Great job!' : 'Keep practicing!',
        status: quality >= 3 ? 'success' : 'info',
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating card',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Keyboard shortcuts
  useHotkeys('1', () => handleReview(1), [currentCardIndex, cards]);
  useHotkeys('2', () => handleReview(2), [currentCardIndex, cards]);
  useHotkeys('3', () => handleReview(3), [currentCardIndex, cards]);
  useHotkeys('4', () => handleReview(4), [currentCardIndex, cards]);
  useHotkeys('5', () => handleReview(5), [currentCardIndex, cards]);

  const averageAccuracy = reviewStats.length > 0
    ? (reviewStats.reduce((acc, stat) => acc + (stat.correct / stat.total), 0) / reviewStats.length) * 100
    : 0;

  const progress = cards.length > 0 ? (currentCardIndex / cards.length) * 100 : 0;

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" py={8}>
        <MotionVStack
          spacing={8}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box position="absolute" top={4} right={4}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </Box>

          <Heading
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontSize="4xl"
            fontWeight="extrabold"
          >
            Spaced Repetition Flashcards
          </Heading>
          
          <Tabs isFitted variant="enclosed" w="100%" colorScheme="blue">
            <TabList>
              <Tab>Review</Tab>
              <Tab>Create</Tab>
              <Tab>Dashboard</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Heading size="md" textAlign="center">
                        Loading cards...
                      </Heading>
                    </motion.div>
                  ) : cards.length > 0 && currentCardIndex < cards.length ? (
                    <motion.div
                      key={currentCardIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Flashcard
                        card={cards[currentCardIndex]}
                        onReview={handleReview}
                        progress={progress}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Heading size="md" textAlign="center">
                        No cards due for review!
                      </Heading>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabPanel>
              
              <TabPanel>
                <CardCreator onCardCreated={loadCards} />
              </TabPanel>
              
              <TabPanel>
                <Dashboard
                  stats={reviewStats}
                  totalCards={cards.length}
                  dueCards={cards.filter(card => new Date(card.nextReview) <= new Date()).length}
                  averageAccuracy={averageAccuracy}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MotionVStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
