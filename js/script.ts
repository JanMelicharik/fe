// Define the structure of the API response
interface DeckApiResponse {
    success: boolean;
    deck_id: string;
    shuffled: boolean;
    remaining: number;
}

// Define possible error types for better error handling
interface ApiError {
    message: string;
    status?: number;
}

// Function to fetch data from the Deck of Cards API
async function fetchDeckData(): Promise<void> {
    // Get DOM elements with proper type assertions
    const remainingElement = document.getElementById('remaining-cards') as HTMLElement;
    const shuffleStatusElement = document.getElementById('shuffle-status') as HTMLElement;
    const deckCard = document.getElementById('deck-card') as HTMLElement;
    const refreshButton = document.getElementById('refresh-btn') as HTMLButtonElement;
    const errorMessage = document.getElementById('error-message') as HTMLElement;
    
    // Check if all elements exist (null safety)
    if (!remainingElement || !shuffleStatusElement || !deckCard || !refreshButton || !errorMessage) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Show loading state
    deckCard.classList.add('loading');
    refreshButton.disabled = true;
    refreshButton.textContent = 'Loading...';
    errorMessage.style.display = 'none';
    
    try {
        // Make the API call with proper typing
        const response: Response = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        
        // Check if the response is ok
        if (!response.ok) {
            const error: ApiError = {
                message: `HTTP error! status: ${response.status}`,
                status: response.status
            };
            throw error;
        }
        
        // Parse the JSON data with type assertion
        const data: DeckApiResponse = await response.json();
        
        // Validate the response structure
        if (typeof data.remaining !== 'number' || typeof data.shuffled !== 'boolean') {
            throw new Error('Invalid API response structure');
        }
        
        // Update the stat cards with the data
        remainingElement.textContent = data.remaining.toString();
        shuffleStatusElement.textContent = data.shuffled ? 'Yes' : 'No';
        
        // Log the full API response for debugging
        console.log('Full API response:', data);
        
    } catch (error: unknown) {
        console.error('Error fetching deck data:', error);
        
        // Type-safe error handling
        let errorText: string = 'An unknown error occurred';
        
        if (error instanceof Error) {
            errorText = error.message;
        } else if (typeof error === 'string') {
            errorText = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
            errorText = String((error as ApiError).message);
        }
        
        remainingElement.textContent = 'Error';
        shuffleStatusElement.textContent = 'Error';
        
        // Show error message to user
        errorMessage.textContent = `Failed to load deck data: ${errorText}`;
        errorMessage.style.display = 'block';
        
    } finally {
        // Remove loading state
        deckCard.classList.remove('loading');
        refreshButton.disabled = false;
        refreshButton.textContent = 'Get New Deck';
    }
}

// Function to initialize the page (with proper typing for event)
function initializePage(): void {
    fetchDeckData();
}

// Type-safe event listener
document.addEventListener('DOMContentLoaded', initializePage);

// Export for potential module usage (optional)
export { fetchDeckData, DeckApiResponse };