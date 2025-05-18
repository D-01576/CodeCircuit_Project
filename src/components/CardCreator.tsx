import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Box,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface CardCreatorProps {
  onCardCreated: () => void;
}

export function CardCreator({ onCardCreated }: CardCreatorProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both question and answer fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cardData = {
        question: question.trim(),
        answer: answer.trim(),
        tags,
        createdAt: new Date(),
        nextReview: new Date(),
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
      };

      await addDoc(collection(db, 'cards'), cardData);

      toast({
        title: 'Success',
        description: 'Card created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Reset form
      setQuestion('');
      setAnswer('');
      setTags([]);
      onCardCreated();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create card. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      w="100%"
      maxW="600px"
      mx="auto"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Question</FormLabel>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              size="lg"
              bg={bgColor}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Answer</FormLabel>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              size="lg"
              bg={bgColor}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <HStack>
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                bg={bgColor}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
              />
              <Tooltip label="Add tag">
                <IconButton
                  aria-label="Add tag"
                  icon={<AddIcon />}
                  onClick={handleAddTag}
                  colorScheme="blue"
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
          </FormControl>

          <HStack spacing={2} wrap="wrap">
            {tags.map((tag) => (
              <Tag
                key={tag}
                size="lg"
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
              >
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveTag(tag)} />
              </Tag>
            ))}
          </HStack>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Creating..."
            w="100%"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
          >
            Create Card
          </Button>
        </VStack>
      </form>
    </MotionBox>
  );
} 