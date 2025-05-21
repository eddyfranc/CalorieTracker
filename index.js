 $(document).ready(function () {
      // Initialize food array from localStorage or empty array
      let foods = JSON.parse(localStorage.getItem('foods')) || [];

      /**
       * Renders the food list and updates total calories
       */
      function renderFoodList() {
        $('#food-list').empty();
        let totalCalories = 0;

        foods.forEach((food, index) => {
          const foodItem = `
            <li class="py-2 flex justify-between items-center">
              <span>${food.name}: ${food.calories} kcal</span>
              <button class="remove-food text-red-500 hover:text-red-700" data-index="${index}">Remove</button>
            </li>`;
          $('#food-list').append(foodItem);
          totalCalories += parseInt(food.calories);
        });

        $('#calorie-sum').text(totalCalories);
      }

      /**
       * Saves food array to localStorage
       */
      function saveToLocalStorage() {
        localStorage.setItem('foods', JSON.stringify(foods));
      }

      /**
       * Simulates fetching calorie data from an API
       * Returns mock data for demonstration
       */
      async function fetchCalorieData(foodName) {
        try {
          // Simulate API response with mock data
          const mockApiResponse = {
            apple: 95,
            banana: 120,
            pizza: 800,
            salad: 150
          };

          // Simulate a fetch call (could be replaced with a real API endpoint)
          const response = await new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({
                  food: foodName,
                  calories: mockApiResponse[foodName.toLowerCase()] || 100 // Default to 100 if not found
                })
              });
            }, 500); // Simulate network delay
          });

          if (!response.ok) throw new Error('Failed to fetch calorie data');
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching calorie data:', error);
          return null;
        }
      }

      // Load initial food list
      renderFoodList();

      // Handle form submission to add food
      $('#food-form').on('submit', function (e) {
        e.preventDefault();
        const foodName = $('#food-name').val().trim();
        const calories = $('#calories').val().trim();

        if (foodName && calories) {
          foods.push({ name: foodName, calories: parseInt(calories) });
          saveToLocalStorage();
          renderFoodList();
          $('#food-form')[0].reset(); // Clear form
        }
      });

      // Handle remove food item
      $('#food-list').on('click', '.remove-food', function () {
        const index = $(this).data('index');
        foods.splice(index, 1);
        saveToLocalStorage();
        renderFoodList();
      });

      // Handle reset button
      $('#reset-button').on('click', function () {
        foods = [];
        saveToLocalStorage();
        renderFoodList();
      });

      // Handle fetch sample calorie data
      $('#fetch-calories').on('click', async function () {
        const foodName = $('#food-name').val().trim() || 'apple'; // Default to 'apple' if empty
        const data = await fetchCalorieData(foodName);
        if (data) {
          $('#food-name').val(data.food);
          $('#calories').val(data.calories);
        } else {
          alert('Could not fetch calorie data. Please try again.');
        }
      });
    });
  