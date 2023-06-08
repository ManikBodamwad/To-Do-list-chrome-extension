document.addEventListener('DOMContentLoaded', function() {
    var taskForm = document.getElementById('taskForm');
    var taskInput = document.getElementById('taskInput');
    var dueDateInput = document.getElementById('dueDate');
    var taskList = document.getElementById('taskList');
  
    // Load tasks from storage
    chrome.storage.sync.get(['tasks'], function(result) {
      var tasks = result.tasks || [];
      tasks.forEach(function(task) {
        createTaskElement(task);
      });
    });
  
    // Add task
    taskForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var taskText = taskInput.value.trim();
      var dueDate = dueDateInput.value;
      if (taskText) {
        var task = {
          text: taskText,
          dueDate: dueDate,
          completed: false
        };
  
        // Save task to storage
        chrome.storage.sync.get(['tasks'], function(result) {
          var tasks = result.tasks || [];
          tasks.push(task);
          chrome.storage.sync.set({ 'tasks': tasks }, function() {
            createTaskElement(task);
            taskInput.value = '';
            dueDateInput.value = '';
          });
        });
      }
    });
  
    // Create task element
    function createTaskElement(task) {
      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', function() {
        task.completed = this.checked;
  
        // Update task in storage
        chrome.storage.sync.get(['tasks'], function(result) {
          var tasks = result.tasks || [];
          var index = tasks.findIndex(function(t) {
            return t.text === task.text;
          });
          if (index !== -1) {
            tasks[index] = task;
            chrome.storage.sync.set({ 'tasks': tasks });
          }
        });
  
        li.classList.toggle('completed');
      });
  
      var label = document.createElement('label');
      label.textContent = task.text;
  
      li.appendChild(checkbox);
      li.appendChild(label);
  
      if (task.dueDate) {
        var dueDate = document.createElement('span');
        dueDate.textContent = task.dueDate;
        li.appendChild(dueDate);
      }
  
      if (task.completed) {
        li.classList.add('completed');
        checkbox.checked = true;
      }
  
      taskList.appendChild(li);
    }
  });
  