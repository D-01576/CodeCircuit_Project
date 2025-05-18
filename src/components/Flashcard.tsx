import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Progress,
  HStack,
  useColorModeValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { Card } from '../utils/sm2';

const MotionBox = motion(Box);

interface FlashcardProps {
  card: Card;
  onReview: (quality: number) => void;
  progress: number;
}

export function Flashcard({ card, onReview, progress }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (card.audioUrl) {
      const newAudio = new Audio(card.audioUrl);
      setAudio(newAudio);
      return () => {
        newAudio.pause();
        newAudio.currentTime = 0;
      };
    }
  }, [card.audioUrl]);

  const playAudio = () => {
    if (audio && !isMuted) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      playAudio();
    }
  };

  const handleReview = (quality: number) => {
    setIsFlipped(false);
    onReview(quality);
  };

  return (
    <VStack spacing={6} w="100%" maxW="600px" mx="auto">
      <Progress
        value={progress}
        size="sm"
        colorScheme="blue"
        w="100%"
        borderRadius="full"
        hasStripe
        isAnimated
      />

      <Tooltip label={isMuted ? 'Unmute' : 'Mute'}>
        <IconButton
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          icon={isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
          onClick={() => setIsMuted(!isMuted)}
          position="absolute"
          top={2}
          right={2}
          variant="ghost"
        />
      </Tooltip>

      <MotionBox
        w="100%"
        h="300px"
        position="relative"
        cursor="pointer"
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={isFlipped ? 'back' : 'front'}
            position="absolute"
            w="100%"
            h="100%"
            bg={bgColor}
            borderRadius="xl"
            boxShadow="xl"
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
            initial={{ rotateY: isFlipped ? 90 : 0, opacity: 0 }}
            animate={{ rotateY: isFlipped ? 0 : 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 0 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backfaceVisibility: 'hidden' }}
            border="1px solid"
            borderColor={borderColor}
          >
            <Text
              fontSize="2xl"
              fontWeight="medium"
              textAlign="center"
              color={useColorModeValue('gray.800', 'white')}
            >
              {isFlipped ? card.answer : card.question}
            </Text>
          </MotionBox>
        </AnimatePresence>
      </MotionBox>

      <AnimatePresence>
        {isFlipped && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            w="100%"
          >
            <HStack spacing={4} justify="center">
              {[1, 2, 3, 4, 5].map((quality) => (
                <Button
                  key={quality}
                  colorScheme={quality >= 3 ? 'green' : 'red'}
                  onClick={() => handleReview(quality)}
                  size="lg"
                  w="60px"
                  h="60px"
                  borderRadius="full"
                  fontSize="xl"
                  fontWeight="bold"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                >
                  {quality}
                </Button>
              ))}
            </HStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </VStack>
  );
} 