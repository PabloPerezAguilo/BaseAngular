xdescribe('angularjs homepage todo list', function() {
	it('should add a todo', function() {
		browser.get('https://angularjs.org');

		element(by.model('todoList.todoText')).sendKeys('write first protractor test');
		//browser.pause();
		element(by.css('[value="add"]')).click();

		var todoList = element.all(by.repeater('todo in todoList.todos'));
		expect(todoList.count()).toEqual(3);
		expect(todoList.get(2).getText()).toEqual('write first protractor test');

		// You wrote your first test, cross it off the list
		todoList.get(2).element(by.css('input')).click();
		var completedAmount = element.all(by.css('.done-true'));
		expect(completedAmount.count()).toEqual(2);
	});
});

describe('Protractor Demo App', function() {
  var firstNumber = element(by.model('first'));
  var secondNumber = element(by.model('second'));
  var goButton = $('#gobutton');
  var latestResult = element(by.binding('latest'));
  var history = element.all(by.repeater('result in memory'));
  var history2 = element.all(by.model('memory'));




  function add(a, b) {
    firstNumber.sendKeys(a);
    secondNumber.sendKeys(b);
    goButton.click();
  }

  beforeEach(function() {
    browser.get('http://juliemr.github.io/protractor-demo/');
  });

  it('should have a history', function() {
    add(1, 2);
    add(3, 4);
    //console.log(history2);
    expect(history.count()).toEqual(2);
    //pect(history2.count()).toEqual(2);

  });
});