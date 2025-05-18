import {
  Box,
  VStack,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MotionBox = motion(Box);

interface DashboardProps {
  stats: { date: string; correct: number; total: number }[];
  totalCards: number;
  dueCards: number;
  averageAccuracy: number;
}

export function Dashboard({ stats, totalCards, dueCards, averageAccuracy }: DashboardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const chartData = stats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString(),
    accuracy: (stat.correct / stat.total) * 100,
    total: stat.total,
  }));

  const recentStats = stats.slice(-7);
  const recentAccuracy = recentStats.length > 0
    ? (recentStats.reduce((acc, stat) => acc + (stat.correct / stat.total), 0) / recentStats.length) * 100
    : 0;

  const accuracyChange = stats.length >= 2
    ? ((recentAccuracy - averageAccuracy) / averageAccuracy) * 100
    : 0;

  return (
    <VStack spacing={8} w="100%" align="stretch">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stat
            px={4}
            py={5}
            bg={bgColor}
            shadow="base"
            rounded="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <StatLabel fontSize="lg">Total Cards</StatLabel>
            <StatNumber fontSize="3xl">{totalCards}</StatNumber>
            <StatHelpText>
              <StatArrow type={dueCards > 0 ? 'increase' : 'decrease'} />
              {dueCards} due for review
            </StatHelpText>
          </Stat>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Stat
            px={4}
            py={5}
            bg={bgColor}
            shadow="base"
            rounded="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <StatLabel fontSize="lg">Average Accuracy</StatLabel>
            <StatNumber fontSize="3xl">{averageAccuracy.toFixed(1)}%</StatNumber>
            <StatHelpText>
              <StatArrow type={accuracyChange >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(accuracyChange).toFixed(1)}% from last week
            </StatHelpText>
          </Stat>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Stat
            px={4}
            py={5}
            bg={bgColor}
            shadow="base"
            rounded="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <StatLabel fontSize="lg">Recent Performance</StatLabel>
            <StatNumber fontSize="3xl">{recentAccuracy.toFixed(1)}%</StatNumber>
            <StatHelpText>
              Last 7 days
            </StatHelpText>
          </Stat>
        </MotionBox>
      </SimpleGrid>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        p={6}
        bg={bgColor}
        shadow="base"
        rounded="lg"
        border="1px solid"
        borderColor={borderColor}
        h="400px"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Performance Over Time
        </Text>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#3182CE"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        p={6}
        bg={bgColor}
        shadow="base"
        rounded="lg"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold">
            Review Progress
          </Text>
          <Progress
            value={(totalCards - dueCards) / totalCards * 100}
            size="lg"
            colorScheme="blue"
            hasStripe
            isAnimated
            borderRadius="full"
          />
          <HStack justify="space-between">
            <Text>Cards Reviewed</Text>
            <Text fontWeight="bold">
              {totalCards - dueCards} / {totalCards}
            </Text>
          </HStack>
        </VStack>
      </MotionBox>
    </VStack>
  );
} 