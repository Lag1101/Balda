#pragma once

#include <vector>
#include <string>
#include <map>

#include "Node.h"

struct Word{
	std::string str;
	size_t weight;
	Word(const std::string & str) : str(str), weight(0) {}
};

class WordTree{
public:
	void add(const std::string & word);
	bool exist(const std::string & word) const;
	void clear();
	void calcStats();
	std::string getEasyWordByLength(size_t length) const;
private:
	static size_t levenshtein_distance(const std::string &s1, const std::string &s2);
private:
	Node root;
	std::vector<Word> words;
	std::map<size_t, std::vector<Word> > wordsByLength;
};