$(document).ready(function () {
  let foods = JSON.parse(localStorage.getItem('foods')) || [];

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

  function saveToLocalStorage() {
    localStorage.setItem('foods', JSON.stringify(foods));
  }

  async function fetchCalorieData(foodName) {
    try {
      const apiKey = '7kJL1SrfxWA7zEGetJAo4znSIa02QORJBZc7YTEQ'; 
      const query = encodeURIComponent(foodName);
      const response = await $.ajax({
        method: 'GET',
        url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
        headers: { 'X-Api-Key': apiKey },
        contentType: 'application/json'
      });

      
      if (response.items && response.items.length > 0) {
        const item = response.items[0];
        return {
          food: item.name || foodName, 
          calories: Math.round(item.calories) || 100 
        };
      } else {
        throw new Error('No nutritional data found for ' + foodName);
      }
    } catch (error) {
      console.error('Error fetching calorie data:', error);
      return null;
    }
  }

  renderFoodList();


  $('#food-form').on('submit', function (e) {
    e.preventDefault();
    const foodName = $('#food-name').val().trim();
    const calories = $('#calories').val().trim();

    if (foodName && calories) {
      foods.push({ name: foodName, calories: parseInt(calories) });
      saveToLocalStorage();
      renderFoodList();
      $('#food-form')[0].reset(); 
  });

  
  $('#food-list').on('click', '.remove-food', function () {
    const index = $(this).data('index');
    foods.splice(index, 1);
    saveToLocalStorage();
    renderFoodList();
  });

  
  $('#reset-button').on('click', function () {
    foods = [];
    saveToLocalStorage();
    renderFoodList();
  });

  
  $('#fetch-calories').on('click', async function () {
    const foodName = $('#food-name').val().trim() || 'apple'; 
    const data = await fetchCalorieData(foodName);
    if (data) {
      $('#food-name').val(data.food);
      $('#calories').val(data.calories);
    } else {
      alert('Could not fetch calorie data for "' + foodName + '". Please try again.');
    }
  });
});