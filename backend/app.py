from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Goal

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///goals.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/goals', methods=['GET', 'POST'])
def handle_goals():
    if request.method == 'GET':
        goals = Goal.query.all()
        return jsonify([goal.to_dict() for goal in goals])
    elif request.method == 'POST':
        data = request.json
        new_goal = Goal(title=data['title'], description=data['description'])
        db.session.add(new_goal)
        db.session.commit()
        return jsonify(new_goal.to_dict()), 201

@app.route('/api/goals/<int:goal_id>', methods=['PUT', 'DELETE'])
def handle_goal(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    if request.method == 'PUT':
        data = request.json
        goal.status = data['status']
        db.session.commit()
        return jsonify(goal.to_dict())
    elif request.method == 'DELETE':
        db.session.delete(goal)
        db.session.commit()
        return '', 204

if __name__ == '__main__':
    app.run(debug=True)