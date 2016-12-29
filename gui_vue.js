Vue.component('todo', {
    'props': ['todo'],
    'template': '\
          <li class="mdl-list__item mdl-list__item--three-line" v-on:click="check">\
              <span class="mdl-list__item-primary-content">{{ todo.description }}</span>\
            <span class="mdl-list__item-secondary-content">\
              <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>\
            </span>\
          </li>',
    'methods': {
        'check': function() {
            this.todo.checked = !this.todo.checked;
            this.$parent.save_todos();
        }
    }
});


var todo_data = {"todos": [
    {"description": "New task ", "checked": false},
    {"description": "Don't write.", "checked": true},
    ]};

app = new Vue({
    'el': '#app',
    'data': {
        'description': '',
        'todos': [],
        'trash': [],
        'selected': 'HOME'
    },
    'created': function () {
        this.trash = JSON.parse(localStorage.getItem('todo'))
        if(!document.cookie) {
            document.cookie = JSON.stringify(todo_data);
        } else {
            this.todos = JSON.parse(document.cookie).todos;
        }
    },
    'computed': {
        'open_todo_count': function () {
            counter = 0;
            for (var i = this.todos.length - 1; i >= 0; i--) {
                counter += !this.todos[i].checked;
            }
            return counter;
        }
    },
    'methods': {
        'home_onclick': function () {
          this.selected = 'HOME';
        },
        'trash_onclick': function () {
          this.selected = 'TRASH';
        },
        'add_todo': function () {
            if(this.description) {
                this.todos.push({'description': this.description, 'checked': false});
                this.description = '';
                this.save_todos();
            }
        },
        'save_todos': function () {
            JSON.stringify({'todos': this.todos});
            document.cookie = JSON.stringify({'todos': this.todos});
        },
        'remove_todo': function () {
            if(!document.cookie) {
                document.cookie = '{"todos": []}';
            } else {
                this.todos = JSON.parse(document.cookie).todos;
                new_list = [];
                for (var i = 0; i < this.todos.length; i++) {
                    if(!this.todos[i].checked) {
                        new_list.push(this.todos[i]);
                    } else {
                        this.trash.push(this.todos[i]);
                        localStorage.setItem('todo', JSON.stringify(this.trash))
                    }
                }
                this.todos = new_list;
            }
            this.save_todos();
        }
    }
})