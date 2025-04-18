import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack,
  Code,
  useColorModeValue
} from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback ? 
        this.props.fallback(this.state.error) : 
        <DefaultErrorFallback 
          error={this.state.error}
          resetErrorBoundary={() => {
            this.setState({ hasError: false, error: null, errorInfo: null });
            if (this.props.onReset) {
              this.props.onReset();
            }
          }}
        />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({ error, resetErrorBoundary }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      p={5}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      my={4}
    >
      <VStack align="stretch" spacing={4}>
        <Heading size="md" color="red.500">Something went wrong</Heading>
        
        <Text>An error occurred in this component. Please try again or contact support if the problem persists.</Text>
        
        {error && (
          <Box 
            p={3} 
            bg={useColorModeValue('gray.50', 'gray.900')}
            borderRadius="md"
            overflowX="auto"
          >
            <Code>{error.toString()}</Code>
          </Box>
        )}
        
        <Button 
          colorScheme="blue" 
          onClick={resetErrorBoundary}
          alignSelf="flex-start"
        >
          Try again
        </Button>
      </VStack>
    </Box>
  );
};

export { ErrorBoundary, DefaultErrorFallback }; 