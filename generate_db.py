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
    message_seed_batman = "This is the vulnerable NodeJS APP designed for the course CY7900, the private package name is: <package-name>"

    message_seed_admin = "This is a CTF!"
    message_seed_jain = "Hello! I am the creator of the CTF"

    seed_users = [
        {
            "username": "batman",
            "password": "password_batman",
            "message": message_seed_batman,
        },
        {
            "username": "admin",
            "password": "password_admin",
            "message": message_seed_admin,
        },
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
        message = f"Batman has sent you a secret code {{Your_Secret_Hash_{flag_hash}}}"
        users.append({"username": username, "password": password, "message": message})

    # create a dictionary to store the array of users
    data = {"users": users}

    # write the data to a json file
    with open("./database/users.json", "w") as json_file:
        json.dump(data, json_file, indent=4)

    print("Generation complete!")
