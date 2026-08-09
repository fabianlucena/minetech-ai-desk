export default {
  backgroundColor: '#888888',
  color: '#D8B128',
  borderColor: '#ccc',
  fontSize: 16,
  borderRadius: 4,
  activityIndicator: {
    size: "large",
    color: "#BE9B23",
  },
  screen: {
    borderRadius: 0,
  },
  header: {
    elevation: 0, // Android
    shadowOpacity: 0, // iOS
    borderBottomWidth: 0, // Web
    backgroundColor: '#504C46', //, '#D8B128',
    title: {
      color: '#D8B128',
      fontSize: 20,
      fontWeight: 'bold',
    },
    icon: {
      color: '#BE9B23',
      marginLeft: 12,
      size: 22,
    },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  icon: {
    size: 24,
    color: '#BE9B23',
  },
  button: {
    backgroundColor: '#D8B128',
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    disabled: {
      backgroundColor: '#ccc',
    },
    label: {
      fontWeight: 'bold',
    },
  },
  field: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 8,
    marginBottom: 10,
    color: '#464646',
    fontSize: 15,
    label: {
      fontSize: 12,
      color: '#6b6b6b',
      marginBottom: 3,
    },
    required: {
      color: '#d32f2f',
      fontSize: 14,
      fontWeight: 'bold',
      marginRight: 2,
    },
  },
  textField: {
  },
  placeholder: {
    color: '#888',
  },
  card: {
    borderColor: '#BE9B23',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5C5145',
    elevation: 2, // Android
    shadowColor: '#353535', // iOS
    shadowOffset: { width: 3, height: 3 }, // iOS
    shadowOpacity: 0.25, // iOS
    shadowRadius: 3.84,
  },
  messageStatusIcon: {
    size: 14,
    color: '#888',
  },
  conversation: {
    card: {
      phone: {
        color: '#888',
        fontSize: 12,
      },
    },
    message: {
      card: {
        padding: 10,
        borderRadius: 8,
        margin: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        alignSelf: 'flex-start',
        backgroundColor: '#2a2a2a',
        mine: {
          alignSelf: 'flex-end',
          backgroundColor: '#143',
        },
        text: {
          color: '#fff',
          fontSize: 14,
        },
        time: {
          color: '#aaa',
          fontSize: 13,
          container: {
            gap: 5,
          },
        },
      },
    },
  },
};