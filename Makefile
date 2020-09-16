.PHONY: serve build push

help:
		@echo ""
		@echo "Usage: make COMMAND"
		@echo ""
		@echo "A Makefile for building and deploying mkdocs markdown website"
		@echo ""
		@echo "Commands:"
		@echo "bash        Enters iterative mode on backend"
		@echo ""

# all: run

# clear1:
# 	sudo docker rm $(sudo docker ps -a -q) 

# clear2:
# 	sudo docker image prune 

# clear3:
# 	sudo docker volume prune

run:
	sudo docker-compose up --build

down:
	sudo docker-compose down

bash:
	sudo docker exec -it backend sh