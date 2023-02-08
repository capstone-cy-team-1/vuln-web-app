import json
import secrets
import argparse

# generate random Hash (also the value for the flag)
def generate_random_hash():
    # 5*2 = 10, will generate a hash of 10 chars
    return secrets.token_hex(5)


# seed sample accounts
def seed_sample():
    ## Define the CTF objective here
    message_seed_levi = "This is Erwin. A valuable code(flag) was sent to your account. \
    The code is critical for the next scouting expedition. The website is not well \
    designed and has a critical vulnerability, find a way to hack into your own account \
    to retrieve the code. You can find your username in the assignment"

    message_seed_eren = "This is a CTF!"
    message_seed_jain = "Hello! I am the creator of the CTF"

    seed_users = [
        {"username": "levi", "password": "password_levi", "message": message_seed_levi},
        {"username": "eren", "password": "password_eren", "message": message_seed_eren},
        {"username": "jain", "password": "password_jain", "message": message_seed_jain},
    ]

    return seed_users


if __name__ == "__main__":

    # taking value of the file containing list of username
    parser = argparse.ArgumentParser()
    parser.add_argument("-filename", help="file containing list of usernames")
    args = parser.parse_args()

    # seeing the sample
    users = seed_sample()

    # read the file of list of usernames
    with open(args.filename, "r+") as file1:
        list_u = file1.read().split("\n")

    # add users to the array
    for username in list_u:
        username = username
        password = flag_hash = generate_random_hash()
        message = f"Your flag is {{nsp_{flag_hash}}}"
        users.append({"username": username, "password": password, "message": message})

    # create a dictionary to store the array of users
    data = {"users": users}

    # write the data to a json file
    with open("./database/users.json", "w") as json_file:
        json.dump(data, json_file, indent=4)

    print("Generation complete!")
